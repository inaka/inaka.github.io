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
            RepoStr = jiffy:encode(Repos),
            file:write_file("../js/projects.js", RepoStr);
        {error, {"401", _, _}} ->
            io:format("Invalid credentials.");
        {error, {Status, _, Message}} ->
            io:format("There was an error while getting the repos: ~s ~s",
                      [Status, Message])
    end,
    halt(0).
