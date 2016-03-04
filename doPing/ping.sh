#!/bin/bash

ping_median() {
		local IPs=$(echo "$1" | cut -c3-)
		local TIMEs=$(fping ${IPs} -b 56 -e -t 1500 -r 0 | grep -Po '(?<=\().*?(?=\))' | tr -d '[ms]')
		local TIMES=(${TIMEs})
		# --------------- MEDIAN :
		local sorted=($(sort <<<"${TIMES[*]}"))
		local mid=$(echo "${#TIMES[@]} / 2" | bc)

		# CASE OF NO VALID IP
		if [[ ${#TIMES[@]} -eq 0 ]]; then
			sorted[mid]="0"
		fi

		local L=$(echo $1 | head -c2)
		sed -i "${2}s/$/ ${sorted[mid]}/" pingTmp.txt
}

while :
do
		# SETUP TEMP FILE
		cat /dev/null > pingTmp.txt
		for (( i = 1; i < 194; i++ )); do
			echo $i >> pingTmp.txt
		done


		for (( i = 0; i < 10; i++ )); do
			lineCount=0
			while read line; do
				let lineCount++
				#L=$(echo $line | head -c2)
				ping_median "$line" $lineCount $i &
				#echo "$L ${STOCK[$L]}"
				sleep 0.05
			done <ip-list.txt
				#sleep 0
				wait
			echo "laps $i ------------- done "
		done
		cat pingTmp.txt > ping.txt
		echo "ping data-file ------------- saved"

done
