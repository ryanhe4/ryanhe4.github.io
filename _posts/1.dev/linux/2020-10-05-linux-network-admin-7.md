---
layout: post
title: "리눅스 네트워크 관리 - 로그"
date: 2020-10-05 11:35:00 +0900
categories: dev
tags: linux
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
Log, rsyslog, 로그서버

<!--more-->

* toc table
{:toc .large-only}

## rsyslog Server on Cent OS 7.X
{:.blue-text}

* Program: rsyslog
* Daemon & Port & Protocol: rsyslogd(514/tcp,udp)
* Configuration File(s): /etc/rsyslog.conf
* Sub Configuration File(s): /etc/rsyslog.d/*.conf
* Service: rsyslog.service

<hr/>

* 기본 체계 실습 - /var/log/secure
* 기본 체계 실습 - /var/log/maillog
* 기본 체계 실습 - /var/log/cron
* 새로운 로그파일 생성 :/var/log/file.log

```console
# vi /etc/rsyslog.d/test.conf
local0.notice   /var/log/file.log
# systemctl restart rsyslog
# logger -p local0.notice "test notice messages"
```

* 스크립트 제작시 로그 직접 생성


### 리눅스 기본 로그 분석

* OS 로그
  - /var/log/messages
  - /var/log/secure
  - /var/log/(boot.log|dmesg)
  - /var/log/(wtmp|btmp)
  - /var/run/utmp
  - /var/log/yum.log
  - /var/log/cron
* 서비스 로그
  - DNS (named : /var/log/messages)
  - WEB (apache httpd: /var/log/httpd/(access_log,error_log))
  - FTP (vsftpd: /var/log/secure, /var/log/xferlog)
  - MAIL (sendmail: /var/log/maillog)
  - NFS (nfsd: /var/log/messages)
  - SAMBA (samba: /var/log/samba/log.*)
* rsyslogd 체계
  - rsyslogd
  - 메세지 종류, 메세지 레벨, 메세지 위치

> 로그 파일 분석 기법

* 로그 파일 예: `/var/log/messages`
* 로그 내용 예: `Apr 16 14:04:42 linux249 smbd[6580]:   prs_grow: Buffer overflow - unable to expand buffer by 2 bytes.`

```console
# alias grep='grep -i --color'
# alias egrep='egrep -i --color'
* 날짜/시간/기간
    # grep "Apr 16" /var/log/messages
    # grep "Apr 16 14:" /var/log/messages
    # grep "Apr 16 14:04:" /var/log/messages
* 로그 생성 서버/IP
    # grep linux249 /var/log/messages
    # grep 172.16.6.25 /var/log/messages
* 검색 단어/키워드
    # grep smbd /var/log/messages
* 로그 난이도(warn|error|crit|alert|emerg|fail)
    # egrep 'warn|error|crit|alert|emerg' /var/log/messages
* 응용(시간 + 메세지 난이도 + 키워드)
    # date +'%b  %-d'
    # grep "$(date +'%b  %-d')" /var/log/messages 
    # grep "$(date +'%b  %-d')" /var/log/messages | egrep -i 'warn|error|crit|alert|emerg|fail' 
    # vi /root/bin/chklog.sh	(# chklog.sh /var/log/messages)
    --------------------------------------
    #!/bin/bash
    DATE=$(date +'%b  %-d')
    grep "$DATE" $1 | egrep -i --color 'warn|error|crit|alert|emerg|fail'
    --------------------------------------
    # chmod 700 /root/bin/chklog.sh
    # /root/bin/chklog.sh /var/log/messages
```


### 로그 파일 관리
* OS 로그 파일 관리
* 서비스 로그 파일 관리
* **logrotate CMD**(/etc/logrotate.conf, /etc/logrotate.d/*) <br> => OS
  로그 파일 관리 + 일부 서비스 로그 파일 관리 <br> => (로그 파일 이름이 고정
  되어 있는 경우) ex) server.log, messages, ...
* **로그 파일 수동 관리** <br>
  => 일부 서비스 또는 관리자가 만든 서비스 로그 기록  
  => (로그 파일 이름이 고정 되어 있지 않은 경우) ex)server_1006.log


### 로그서버 구축

> on linux1XX

```console
# vi /etc/rsyslog.conf , (TCP 사용)
# vi /etc/rsyslog.d/test.conf
local0.notice /var/log/file.log
# touch /var/log/file.log
# chmod 600 /var/log/file.log
# systemctl restart rsyslog

# tail -f /var/log/file.log
```

> on linux2XX

```console
# vi /etc/rsyslog.conf (TCP 사용)
# vi /etc/rsyslog.d/test.conf
local0.notice @@172.16.6.1XX
# systemctl restart rsyslog
# logger -p local0.notice "Notice"
```

### 로그 서버 구축2


> on linux1XX

```console
# vi /etc/rsyslog.d/test.conf
local0.crit /var/log/file.log
# systemctl restart rsyslog
# tail -f /var/log/file.log
```

> on linux2XX

```console
# vi /etc/rsyslog.d/test.conf
local0.notice       /var/log/file.log
local0.crit         @@172.16.6.1XX
# systemctl restart rsyslog
```

### 정리

```
WIN                 ----+
LINUX               ----+
UNIX                ----+----> Linux(rsyslogd)
Network             ----+
Security            ----+
Storage             ----+
```

eventlog-to-syslog Log Analyzer

