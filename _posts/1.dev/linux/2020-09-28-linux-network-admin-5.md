---
layout: post
title: "리눅스 네트워크 관리 - MAIL"
date: 2020-09-28 13:00:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
MAIL SERVER, SMTP(Simple Mail Transfer Protocol)
* MTA : sendmail/postfix/qmail, MS Exchange
* MUT : mail, procmail
* MDA : Outlook, thunderbird, evolution, mutt

**프로토콜**
* SMTP/ESMTP => smtps
* POP3/IMAP4 => pops/imaps

<!--more-->

* toc
{:toc}

## postfix => sendmail
```console
# systemctl disable postfix
# systemctl stop postfix 

yum -y install sendmail
# systemctl enable sendmail
# systemctl restart sendmail

## dovecot 설치 및 설정(pop3 , imap4)
# yum install dovecot
# vi /etc/dovecot/dovecot.conf
> protocol = imap pop3
> listen = *, ::

# vi /etc/dovecot/conf.d/10-mail.conf
> mail_location = mbox:MEMORY:INBOX=/var/spool/mail/%u:INDEX=MEMORY

# vi /etc/dovecot/conf.d/10-auth.conf
> disable_plaintext_auth = no

# systemctl enable dovecot
# systemctl restart dovecot
```

## snedmail MAIL Server on Cent OS 7.X 
* Program: sendmail
* Daemon & Port & Protocol: sendmail(25/tcp)
* Configuration File(s): /etc/mail/sendmail.cf 
* Sub Configuration File(s): /etc/mail/*
* Service: sendmail.service


## dovecot POP3/IMAP4 Server on Cent OS 7.X 
* Program: dovecot
* Daemon & Port & Protocol: dovecot(110/tcp:pop3, 143/tcp:imap)
* Configuration File(s): /etc/dovecot/dovecot.conf 
* Sub Configuration File(s): /etc/dovecot/conf.d/*.conf
* Service: dovecot.service

### 프로토콜 & 포트번호
* smtp    25/tcp
* smtps   465/tcp
* pop3    110/tcp
* pop3s   995/tcp
* imap    143/tcp
* imaps   993/tcp

### 메일 클라이언트 프로그램 간단한 사용법
* (CLI) mail/mailx CMD
```console
# mail [-v] webmaster@example.com
# mail -u webmaster
# mail -s "Test mail" webmaster@example.com < report.txt
```
* (GUI) evolution, thunderbird
```conosle
# yum install evolution
# evolution &
```

### 메일 서버 구성
```console
# vi /etc/mail/sendmail.cf
> Djmail.linux2XX.example.com
> O EightBitMode=pass8
> O DaemonPortOptions=Port=smtp, Name=MTA
# vi /etc/mail/local-host-names
> linux2XX.example.com
> mail.linux2XX.example.com
# vi /etc/mail/access
> Connect:mail.linux2XX.example.com     RELAY
> Connect:mail.example.com              RELAY
> Connect:mail.172.16.6                 RELAY
# cd /etc/mail ; makemap hash access > access
# systemctl enable sendmail
# systemctl restart sendmail
```

### 메일 보내기
* Local -> Local
* Local -> Remote
* Remote -> Local

### 메일 포워딩 실습
* mail01 --> forwarding --> mail02
```console
# vi /etc/aliases
> mail01:mail02
# newaliases
# useradd mail02
# echo mail02 | passwd --stdin mail02 
# mail user01
```

### 간단한 메일링 리스트 작성 - /etc/aliases
* 회사내 전체 공지 메일
* 회사내 팀원 메일
* 메일을 한곳으로 모으기

```console
# vi /etc/aliases
> myteam:team01, team02, tea03
> mycompany::include:/etc/mail/list/mycompany.txt
# newaliases
# systemctl restart sendmail
# mail -s "Test Mail" myteam < /etc/hosts
# mail -s "Test Mail" mycompany < /etc/hosts
```

> awk CMD

```console 
# awk -F: '$3 >= 1000 && $3 <= 60000 {print $1}' /etc/passwd
```

### 메일 클라이언트 프로그램 
* (GUI) evolution, thunderbird
* (TUI) mutt
* (CLI) mail/mailx

```console
# yum instasll evolution
# evolution &
```
* 보내는 메일 서버: mail.linux2XX.example.com 25 
* 받는 메일 서버: mail.linux2XX.example.com 110

### 웹 메일 서버
* squirrelmail
```console
# yum --enablerepo=epel install -y squirrelmail
# rpm -ql

# chown -R apache:apache /user/share/squirrelmail
# chown apache:apache /etc/squirrelmail/config.php
# chown -R apache:apache /var/lib/squirrelmail
# chown -R apache:apache /var/spool/squirrelmail

# /usr/share/squirrelmail/config/config.pl
# systemctl restart httpd

```
