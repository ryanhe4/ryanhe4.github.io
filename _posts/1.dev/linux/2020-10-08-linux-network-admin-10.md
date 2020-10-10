---
layout: post
title: "리눅스 네트워크 관리 - NTP"
date: 2020-10-08 10:50:00 +0900
categories: dev
tags: linux
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
NTP(Network Time Protocol)

<!--more-->

* toc table
{:toc .large-only}

> NTP의 필요성

정보나 자원을 제공하는 서버의 시간이 다르면 안되기 떄문에 항상 동기화 되있어야 한다. 
* NTP Server | NTP CLient
* `rdate CMD` + `crontab CMD` (사용 편리)

> 원격서버 시간과 로컬서버 시간을 확인
 
```bash
ssh 172.16.6.249 data | rdate -p 172.16.6.252 
date
``` 

## NTP(chrony) Server on Cent OS 7.X
* Program: 
* Daemon & Port & Protocol: chronyd(123/tcp)
* Configuration File(s): /etc/chrony.conf
* Sub Configuration File(s):
* Service: chronyd.service

<hr/>

### Main NTP Server 구성
```coffeescript
# telnet 172.16.6.252
root 사용자로 로그인
# cat /etc/ntp.conf
restrict 172.16.6.0 mask 255.255.255.0 nomodify notrap
server  127.127.1.0 # local clock
# crontab -l -u root
1  0  *  *  *  rdate -s time.bora.net
```


### 지역 및 로케일 설정 + NTP Server 구성
```console
# timedatectl
# tzselect    (# timedatectl list-timezones | grep -i seoul) 
-> Asia/Seoul
# timedatectl set-timezone Asia/Seoul
```

**서버 설정**
```coffeescript
server 172.16.6.252 iburst
allow 172.16.6.0/24
```
{:.note title="/etc/chrony.conf"}

**시스템 재기동**
```console
# systemctl restart chronyd
[TERM2] # tcpdump -i ens33 port 123
```

### 지역 및 로케일 설정 + NTP Client 구성
```console
# timedatectl
# timedatectl set-timezones Asia/Seoul

# chrouyc sources -v 
# timedatectl 
-> NTP synchronized: yes
```

**서버 설정**
```properties
# yum install chrony
# vi /etc/chrony.conf
server 172.16.6.222 iburst
```

**시스템 재기동**
```console
# systemctl restart chronyd
[TERM2] # tcpdump -i ens33 port 123

# chronyc sources -v
# timedatectl
```

