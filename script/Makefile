PROJECT = inaka_github

DEPS = egithub

dep_egithub = https://github.com/inaka/erlang-github.git master

include erlang.mk

ERLC_OPTS += +'{parse_transform, lager_transform}'
ERLC_OPTS += +warn_unused_vars +warn_export_all +warn_shadow_vars +warn_unused_import +warn_unused_function
ERLC_OPTS += +warn_bif_clash +warn_unused_record +warn_deprecated_function +warn_obsolete_guard +strict_validation
ERLC_OPTS += +warn_export_vars +warn_exported_vars +warn_missing_spec +warn_untyped_record +debug_info

shell: app
	erl -pa ebin -pa deps/*/ebin -s sync -s elvis -s lager -config config/app.config

run: app
	erl -pa ebin -pa deps/*/ebin -s inaka_github -noshell -config config/app.config
