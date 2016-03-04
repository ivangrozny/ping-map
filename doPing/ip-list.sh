#!/bin/bash
while :
do
  echo `python blockfinder-master/blockfinder.py -i`
  cat /dev/null > ip-list_tmp.txt
  list=(AF AL DZ AD AO AG AR AM AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI KH CM CA CV CF TD CL CN CY CO KM CG CR HR CU CZ DK DJ DO DM TL EG GQ EC ER EE ET FJ PH FI FR GA GM GE DE GH GD GR GT GW GN GY HT HN HU IS IN ID IR IQ IE IL IT CI JM JP JE KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MK MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MA MZ MM NA NR NP NL NZ NI NG NE KP NO OM PK PW PA PG PY PE PL PT QA RO RU RW SV WS ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK KN LC MF VC SD SR SZ SE CH SY TJ TZ TH TG TO TT TN TR TM TV US UG UA AE GB UY UZ VU VE VN YE CD ZM ZW)

  for i in ${list[@]}; do
    NB=(`python blockfinder-master/blockfinder.py -t $i:ipv4`) #scan NetBlock
    echo -n "$i " >> ip-list_tmp.txt

    if [ "$i" == "KP" ]; then # north korea
      echo -n "103.20.124.177 103.20.124.221 103.49.174.193 103.49.174.141 " >> ip-list_tmp.txt
    elif [ "$i" == "ST" ]; then #sao tome
      echo -n "103.20.124.177 103.20.124.221 103.49.174.193 103.49.174.141 " >> ip-list_tmp.txt
    elif [ "$i" == "TV" ]; then #tuvalu
      echo -n "103.20.124.177 103.20.124.221 103.49.174.193 103.49.174.141 " >> ip-list_tmp.txt
    elif [ "$i" == "ER" ]; then #eritrea
      echo -n "197.156.64.54 197.156.64.18 197.156.64.147 197.156.64.34 " >> ip-list_tmp.txt
    else
      while true; do
        rand=$((RANDOM%${#NB[@]}))
        rand2=$((RANDOM%256))
        IP=`fping -a -r 0 ${NB[$rand]%.*}.$rand2 $` # tell if IP is active
        if [[ ("${#IP}" < 15) && ("${#IP}" > 0) ]]; then
          let count++
          echo -n "${IP} " >> ip-list_tmp.txt
          if [[ $count > 1 ]]; then # IPs per country
            count="0"
            break
          fi
        fi

      done
    fi
    echo "" >> ip-list_tmp.txt
  done
  cat ip-list_tmp.txt > ip-list.txt
  echo "new ip-list data-file ------------- saved"
  sleep 28800 # (standby 8h)
done
