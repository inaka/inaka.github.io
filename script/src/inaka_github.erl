-module(inaka_github).

-export([start/0]).

-spec start() -> ok.
start() ->
    {ok, _} = application:ensure_all_started(inaka_github),

    {ok, [Username]} = io:fread("GitHub user: ", "~s"),
    {ok, [Password]} = io:fread("GitHub password: ", "~s"),
    Cred = {basic, Username, Password},
    Opts = #{type => "public"},
    case elvis_github:all_repos(Cred, "inaka", Opts) of
        {ok, Repos} ->
            Processed = process_repos(Cred, Repos),
            RepoStr = jiffy:encode(Processed),
            file:write_file("../js/projects.js", RepoStr);
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
                 ) and not Fork
        end,
    Map = fun (Repo) -> authors(Cred, Repo) end,

    Filtered = lists:filter(Filter, Repos),
    lists:map(Map, Filtered).
