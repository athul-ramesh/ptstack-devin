#!/usr/bin/env bash
# Mutate a ProgramState store. One writer. Unit set is idempotent.
# Usage:
#   program-state.sh init <dir> <objective>
#   program-state.sh set <dir> <id> <owner> <state> <deps> <evidence> <head>
#   program-state.sh status <dir>
set -euo pipefail

usage() {
	printf 'usage: program-state.sh init <dir> <objective>\n' >&2
	printf '       program-state.sh set <dir> <id> <owner> <state> <deps> <evidence> <head>\n' >&2
	printf '       program-state.sh status <dir>\n' >&2
	exit 1
}

clean() {
	local v
	v=$(printf '%s' "$1" | tr '\t\n\r' '   ')
	case "$v" in
		=*|+*|-*|@*) printf "'%s" "$v" ;;
		*) printf '%s' "$v" ;;
	esac
}

write_status() {
	local dir="$1"
	local units="$dir/units.tsv"
	local out="$dir/status.md"
	local obj="$dir/objective.txt"
	{
		if [ -f "$obj" ]; then
			printf 'objective: %s\n' "$(tr '\n' ' ' <"$obj" | sed 's/ *$//')"
		else
			printf 'objective: \n'
		fi
		if [ -f "$units" ]; then
			tail -n +2 "$units" | awk -F '\t' '
				$3=="pending" {p++}
				$3=="in-progress" {i++}
				$3=="verified" {v++}
				$3=="not-verified" {n++}
				$3=="inconclusive" {c++}
				$3=="abandoned" {a++}
				END {
					printf "pending: %d\n", p+0
					printf "in-progress: %d\n", i+0
					printf "verified: %d\n", v+0
					printf "not-verified: %d\n", n+0
					printf "inconclusive: %d\n", c+0
					printf "abandoned: %d\n", a+0
				}
			'
		else
			printf 'pending: 0\nin-progress: 0\nverified: 0\nnot-verified: 0\ninconclusive: 0\nabandoned: 0\n'
		fi
	} >"$out"
}

[ "$#" -ge 1 ] || usage
cmd="$1"
shift

case "$cmd" in
	init)
		[ "$#" -eq 2 ] || usage
		dir="$1"
		objective="$(clean "$2")"
		mkdir -p "$dir"
		units="$dir/units.tsv"
		obj="$dir/objective.txt"
		if [ ! -f "$units" ]; then
			printf 'id\towner\tstate\tdeps\tevidence\thead\n' >"$units"
		fi
		if [ ! -f "$obj" ]; then
			printf '%s\n' "$objective" >"$obj"
		else
			current="$(tr -d '\n' <"$obj")"
			if [ "$current" != "$objective" ]; then
				printf 'program-state.sh: objective already set\n' >&2
				exit 1
			fi
		fi
		write_status "$dir"
		;;
	set)
		[ "$#" -eq 7 ] || usage
		dir="$1"
		id="$(clean "$2")"
		owner="$(clean "$3")"
		state="$(clean "$4")"
		deps="$(clean "$5")"
		evidence="$(clean "$6")"
		head="$(clean "$7")"
		case "$state" in
			pending|in-progress|verified|not-verified|inconclusive|abandoned) ;;
			*)
				printf 'program-state.sh: bad state %s\n' "$state" >&2
				exit 1
				;;
		esac
		units="$dir/units.tsv"
		if [ ! -f "$units" ]; then
			printf 'program-state.sh: missing %s\n' "$units" >&2
			exit 1
		fi
		row=$(printf '%s\t%s\t%s\t%s\t%s\t%s' "$id" "$owner" "$state" "$deps" "$evidence" "$head")
		tmp=$(mktemp)
		awk -F '\t' -v OFS='\t' -v id="$id" -v row="$row" '
			BEGIN { found=0 }
			NR==1 { print; next }
			$1==id {
				found=1
				if ($0==row) print
				else print row
				next
			}
			{ print }
			END {
				if (!found) print row
			}
		' "$units" >"$tmp"
		if cmp -s "$units" "$tmp"; then
			rm -f "$tmp"
		else
			mv "$tmp" "$units"
		fi
		write_status "$dir"
		;;
	status)
		[ "$#" -eq 1 ] || usage
		dir="$1"
		write_status "$dir"
		cat "$dir/status.md"
		;;
	*)
		usage
		;;
esac
