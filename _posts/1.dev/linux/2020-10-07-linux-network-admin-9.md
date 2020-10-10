---
layout: post
title: 리눅스 네트워크 관리 - SSH & DB
date: 2020-10-07 09:51:00 +0900
categories: dev
tags: linux
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
SSH 설정 및 mariaDB 설정

<!--more-->

* toc table
{:toc .large-only}

> 와이어 샤크 설치

```console
# yum install wireshark wireshark-gnome
# wireshark &
```

## SSH(sshd) Server on Cent OS 7.X

* Program: openssh, openssh-sever, openssh-clients
* Daemon & Port & Protocol: sshd(22/tcp)
* Configuration File(s): /etc/ssh/sshd.config,ssh_config
* Sub Configuration File(s):
* Service: sshd.service

<hr/>

> sCMD(ssh/sftp/scp) 사용법 

### 공개 키 인증(Public KEy Authentication) 
linux1XX -> linux2XX 접속

> on linux1XX

키생성 후 목표 서버에 키 저장
```console
# ssh-keygen -t rsa
# ssh-copy-id -i ~/.ssh/id_rsa.pub root@172.16.6.2XX
```

### 공개 키 인증(Public KEy Authentication) - 임시적인 사용

```console
# ssh-keygen -t rsa
# ssh-copy-id -i ~/.ssh/id_rsa.pub root@172.16.6.2XX
# ssh-agent bash
# ssh-add
# ssh [ip]
```

### 공개 키 인증(Public KEy Authentication) - 영구적인 사용
암호 없이 `ssh-keygen` 수행
```console
# ssh-keygen -t rsa
# ssh-copy-id -i ~/.ssh/id_rsa.pub root@172.16.6.2XX
```

### cmd.sh/ copy.sh
다중 시스템 원격 관리
```bash
#!/bin/bash

echo "=== linux222 ==="
ssh 172.16.6.222 $*
echo
echo

echo "=== linux122 ==="
ssh 172.16.6.122 $*
```

### 사용자 접근 제어
root 사용자 접근 제어 - sshd_config: `PermitRootLogin no`
일반 사용자 접근 제어 - sshd_Config: `AllowUsers user01 user02`

### SSH 포트 번호 변경
sshd_Config : Port [포트번호]

### X11 Forwarding
```terminal
# ssh -X 172.6.6.2XX
# system-config-monitor & 
```

### X11 Port Forwarding
```
----------Local Port Forwarding ---------
web client                  web server(80)

http://server:80            
http://localhost:8080

# ssh -L 8080:localhost:80 -N user@WebServer
# firefox http://localhost:8080

----------Remote Port Forwarding ---------
web client                  web server(80)

http://server:80            
http://localhost:8080

                            # ssh -R 8080:localhost:80 -N user@WebServer
# firefox http://localhost:8080
```

## DB(Database) Server on Cent OS 7.X

* Program: mariadb-server, mariadb
* Daemon & Port & Protocol: mysqld(3306/tcp)
* Configuration File(s): /etc/my.cnf
* Sub Configuration File(s): /etc/my.cnf.d/*.cnf
* Service: mariadb.service

<hr/>

### root password recovery
```console
# systemctl stop mariadb
# /user/bin/mysqld_safe __skip-grant &
# mysql -uroot mysql
MariaDB > update user set password=password('pass') where user='root';
MariaDB > flush privileges;
MariaDB > exit
# mysql -u root -p 
```

### mariadb 설치 및 설정
```console
# yum install mariadb mariadb-server
# mysql_secure_installation
# systemctl enable mariadb
# systemctl start mariadb
# mysql -u root -p
```
