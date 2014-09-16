-module(inaka_github).

-export([start/0]).

-spec start() -> ok.
start() ->
    {ok, _} = application:ensure_all_started(inaka_github),

    {Username, Password} =
        case application:get_env(inaka_github, github_user) of
            undefined ->
                {ok, [User]} = io:fread("GitHub user: ", "~s"),
                {ok, [Pass]} = io:fread("GitHub password: ", "~s"),
                {User, Pass};
            {ok, User} ->
                {ok, Pass} = application:get_env(inaka_github, github_password),
                {User, Pass}
        end,
    Cred = {basic, Username, Password},
    Opts = #{type => "public"},
    case elvis_github:all_repos(Cred, "inaka", Opts) of
        {ok, Repos} ->
            Processed = process_repos(Cred, Repos),
            RepoStr = jiffy:encode(Processed),
            file:write_file("../web/js/projects.js", RepoStr);
        {error, {"401", _, _}} ->
            io:format("Invalid credentials.");
        {error, {Status, _, Message}} ->
            io:format("There was an error while getting the repos: ~s ~s",
                      [Status, Message])
    end,
    halt(0).

authors(Cred, Repo) ->
    {ok, DefaultAuthors} = application:get_env(inaka_github, default_authors),
    FullName = maps:get(<<"full_name">>, Repo),
    case elvis_github:file_content(Cred, FullName, "master", "AUTHORS") of
        {ok, Content} ->
            Authors = binary:split(Content, <<"\n">>, [global]),
            Repo#{authors => Authors};
        {error, _} ->
            Repo#{authors => lists:map(fun list_to_binary/1, DefaultAuthors)}
    end.

process_repos(Cred, Repos) ->
    {ok, Ignored} = application:get_env(inaka_github, ignore),
    {ok, Included} = application:get_env(inaka_github, include),
    Filter =
        fun (#{<<"name">> := Name,
               <<"full_name">> := FullName,
               <<"fork">> := Fork}) ->
                NameStr = binary_to_list(Name),
                FullNameStr = binary_to_list(FullName),
                not (
                  lists:member(NameStr, Ignored)
                  or
                  lists:member(FullNameStr, Ignored)
                 ) and (
                     not Fork
                     or
                     lists:member(NameStr, Included)
                    )
        end,
    Map = fun (Repo) -> authors(Cred, Repo) end,

    Filtered = lists:filter(Filter, Repos),
    lists:map(Map, Filtered).
