---
layout: post
title: "리눅스 네트워크 관리 - FTP"
date: 2020-09-25 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
FTP(File Transfer Protocol)
<!--more-->

* toc
{:toc}

## vsftpd FTP Server on Cent OS 7.X 
* Program: vsftpd ftp
* Daemon & Port & Protocol: vsftpd, 20(TCP), 21(TCP)
* Configuration File(s): /etc/vsftpd/vsftpd.conf 
* Sub Configuration File(s): /etc/vsftpd/*
* Service: vsftpd.service

### vsftpd 서버에 root 사용자 접속 허용
```
# yum install ftp vsftpd
# cd /etc/vsftpd ; vi ftpusers ; vi user_list
```

### ftp 클라이언트 툴 사용법
**gftp**
```console
# yum install epel-release
# yum --enablerepo=epel install gftp
# gftp &
```

**ftp CMD**
```console
# ftp 172.16.6.252
login
ftp> cd /tmp ; lcd /test (업로드 / 다운로드 포인터)
ftp> bin ; hash; prompt (편리한 기능 설정)
ftp> mget ; mput (파일 전송)
ftp> ls ; !ls, (확인, 해제) 
```

### (WIN)ftp CMD <-- transfer --> (LINUX) vsftpd
### 배너 메세지 설정
* banner_file
```console
# vi /etc/vsftpd/vsftpd.conf
> banner_file=/etc/vsftpd/banner.txt
# systemctl restart vsftpd
# ftp localhost
```

### 인증된 사용자에 대한 chroot 구성
```console
# vi /etc/vsftpd/vsftdpd.conf
chroot_local_user=YES
allow_writeable=YES

# systemctl restart vsftpd
```

### FTP - 사용자 접근 제어
* root, oracle, wasuser: FTP 서버 접근 가능 설정
```console
# vi /etc/vsftpd/vsftdpd.conf
userlist_enable=YES
userlist_deny=NO
# vi /etc/vsftpd/user_list
root
oracle
wasuser
```

### Anonymous FTP 구성
```
# vi /etc/vsftpd/vsftpd.conf
anonymous_enable=YES
# systemctl restart vsftpd
# ftl localhost
# anonymous/id@email.com
-> /varftp
```

### FTP 포트 변경
```console
# vi /etc/vsftpd/vsftpd.conf
listen_port=2121
# systemctl restart vsftpd
# ftp localhost 2121
```

### 최대 연결 개수/아이피 최대 연결
```console
# vi /etc/vsftpd/vsftpd.conf
max_clients=100
max_per_ip=3
# systemctl restart vsftpd
```

### 익명사용자 FTP 업로드 기능 설정
```console
# mkdir -p -m 603 /var/ftp/pub/
# useradd -s /sbin/nologin -r -d /var/ftp/pub/incoming ftpupload

# vi /etc/vsftpd/vsftpd.conf
anon_upload_enable=YES
chown_uploads=YES
chown_username=ftpupload
```

### Anonymous FTP 다운로드 사이트의 보안 구성
```console
# cd /var/ftp/pub
# mkdir -p -m 701 download
# mkdir -p -m 701 download/os
# mkdir -p -m 701 download/os/centos
# cp /etc/passwd download/os/centos/centos5.img

# ftp localhost
ftp> anonymous
ftp> cd pub/download/os/centos
ftp> get centos5.img
```

## 보안
* 네트워크/호스트 접근 제어 => 방화벽(firewalld)
* 사용자 접근 제어 => userlist_enable=YES, userlist_deny=NO, /etc/vsftpd/user_list
* 포트 관리 => listen_port=21
* 소프트웨어 업데이트 => yum update vsftpd
* 최근 보안 정보 => http://vsftpd.beasts.org
* 관련 문서 확인 => /usr/share/odc/vsftpd-*/*
* 로그 분석
    - /var/log/secure
    - /var/log/xferlog
    - /var/log/audit/audit.log

> FTP 포트 체계

* active mode(21/tcp, 20/tcp)
* passive mdoe(21/tcp, 1024 이상/tcp)
