---
layout: post
title: "리눅스 네트워크 관리 - DNS"
date: 2020-09-22 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
DNS
<!--more-->

* toc
{:toc}

# DNS
서비스 설정 가이드(DNS 서비스)
1. 패키지 설치(yum install bind)
1. 설정(vi /etc/named.conf)
1. 서비스 기동(systemctl restart/enable bind)
1. 방화벽 등록(firewall-config)
1. SELinux 설정

### Service 9.X on Cent OS 7.X 
* Program: bind + bind-chroot
* Daemon & Port & Protocol: named, 53(TCP/UDP)
* Configuration File(s): /var/named/
* Service: named.service
----------------------------------------------
**추가 정리 부분: 기능**

----------------------------------------------
### linux222.example.com DNS 서버 구축
DNS Server
* /etc/named.conf
* /etc/named.rfc1912.zones
* /var/named/example222.zone
* /var/named/example222.rev
* /var/named/named.ca

DNS Client
* /etc/resolv.conf

### nameserver lookup command
* nslookup CMD
* dig CMD
* host CMD

### 도메인 등록
```console
# vi /var/namd/example2XX.zone
# systemctl restart named

# cp /etc/passwd /var/www/html/index.html
```

### DNS 부하분산
```console
# vi /var/named/example222.zone
www IN  A   IP(172.16.6.[2,3,4])
#systemctl restart named
# nslookup www.linux222.example.com
```

### 도메인 위임
```
(example.com) -- delegation --> (linux2XX.example.com)
co.kr                           yahoo.co.kr
```

```console
# vi /var/named/example2XX.zone
linux2XX     IN NS ns1.linux2XX
ns1.linux2XX IN A  172.16.6.2XX
# vi /var/named/example2XX.rev
2XX         IN  PTR ns1.linux2XX.example.com.
# systemctl restart named
# nslookup -q=NS linux2XX.example.com 
```

### Master/Slave DNS Server
> On Master

```console
# yum -y install bind
# vi /etc/named.conf
> also-notify
# vi /etc/named.rfc1912.zones
# vi /var/named/example2XX.zone
# vi /var/named/example2XX.rev
# systemctl restart named
# systemctl enable named
```

> On Slave

```console
# yum -y install bind
# vi /etc/named.conf
# vi /etc/named.rfc1912.zones
> type slave
> masters 지시자
# systemctl restart named
# systemctl enable named
```

### 존(ZONE) 파일 업데이트, Zone Transfer
**SOA Resource Type**
* 시리얼 번호: Zone 파일을 업데이트하는 키
* Refresh Time: 업데이트(동기화) 시간
* Retry Time: 동기화 실패 시 재시도 시간
* Expire Date: 업데이트 데이터의 유지시간
* TTL, Time To Live: 캐싱 시간

### rndc CMD
```console
# rpm -ql bind | egrep rndc
> /etc/rndc.conf
> /etc/rndc.key 

# rndc-confgen
# vi /etc/rndc.conf
# vi /etc/named.conf
# systemctl restart named

# rndc status
# rndc stats ; cd /var/named/data && ls 
# rndc reload
```

### allow-update/nsupdate CMD
**nsupdate**: DNS서버의 Zone Data 명령어를 사용하여 업데이트 및 관리 할 수 있는 명령어

**allow-update 지시자**: DNS Server에서 지정, nsupdate 명령어를 허용할 IP를 지정 

### allow-transfer
Zone Data Transfer를 할 수 있는 Slave IP 지정

## 보안
* DNS 서버  `설정/보안` 점검<br>
    krnic.or.kr > 도메인네임시스템 > DNS 자가점검
* chroot 구성
    1. `# yum install bind-chroot`
    1. docker
* allow-transfer, allow-query
* 최신 취약점 점검        
* 인증방식 /데이터 암호화<br>
    DNSSEC

## 관리
* DNS 통계 모니터링
    http://sourceforge.net/projects/dns
