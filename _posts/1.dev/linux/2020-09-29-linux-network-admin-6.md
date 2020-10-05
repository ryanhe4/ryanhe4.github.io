---
layout: post
title: "리눅스 네트워크 관리 - NFS & SAMBA"
date: 2020-09-29 11:35:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
NFS(Network File System)
<!--more-->

* toc
{:toc}

## NFS Server on Cent OS 7.X 
* Program: nfs-utils
* Daemon & Port & Protocol: nfsd(2049/tcp)
* Configuration File(s): /etc/exports 
* Sub Configuration File(s): /etc/exports.d/*
* Service: nfs.service | nfs-server.service

> NFSv2 vs NFSv3 vs NFSv4

| NFS Version |protocol | nfsd | mount|
|:------------|:--------|:------------|:-----|
|NFSv2| UDP     |nfsd(2049)|mountd(?)|
|NFSv3| UDP/TCP |nfsd(2049)|mountd(?)|
|NFSv4| TCP/UDP |nfsd(2049)||

* NFS 서버 관련 데몬들
    - nfsd
    - mountd
* NFS 서버 관련 파일들
    - /etc/exports
    - /etc/fstab
* NFS 서버 관련 명령어들
    - exportfs: `# exportfs -v`, `# exportfs -ar`
    - showmount: `showmount -e 172.16.6.252`
    - mount
    
### NFS 공유 설정 하는 방법
```console
# mkdir -p /share
# vi /etc/exports   (# vi /etc/exports.d/sharedir.txt)
> /share    172.16.6.0/24(rw)
# systemctl enable nfs  (# systemctl enable nfs-server)
# systemctl restart nfs (# systemctl restart nfs-server)
# exportfs -v
```        

### root 사용자의 서버 자원 마운트
* 일반 사용자 마운트 -> UID/GID chech
* root 사용자 마운트 -> anonymous(nfsmount)

```console
# vi /etc/exports
/share 172.16.6.0/24(rw,no_root_squash)
# systemctl restart nfs
```

### MAN Page 서버 구축
**Server**
```console
# vi /etc/exports
/usr/share/man  172.16.0./24(ro)
# systemctl restart nfs
```

**Client**
```console
# cd /usr/share/man
# mv man man.old

# mkdir man
# mount 172.16.6.2XX:/usr/share/man /usr/share/man
# man ls
```

### Home Directory Server 구축
**Server**
```console
# mkdir -p /export/home
# useradd -u 5000 -g 100 -d /export/home/nfsuser nfsuser
# passwd nfsuser

# vi /etc/exports
/export/home        172.16.6.0/24(rw)
# systemctl restart nfs
# exportfs -v
```
**Client**
```console
# useradd -u 5000 -g 100 -M nfsuser
# passwd nfsuser

# mkdir -p /home/nfsuser
# mount 172.16.6.222:/export/home/nfsuser /home/nfsuser
# telnet localhost
```

### 원격 CD/DVD 공유
**Server**
```console
# umount /dev/sr0
# mkdir -p /mnt/cdrom ; mount -t iso9660 -o ro /dev/sr0 /mnt/cdrom
# vi /etc/exports
/mnt/cdrom      172.16.6.0/24(ro)
# systemctl restart nfs
```

**Client**
```console
# mkdir -p /mnt/cdrom ; mount 172.16.6.222:/mnt/cdrom /mnt/cdrom
# ls /mnt/cdrom
```

### 원격 백업 서버 구축
**Server**
```console
# mkdir -p /backup/linux2XX
# vi /etc/exports
/backup/linux2XX    172.16.6.2XX(rw,no_root_squash)
# systemctl restart nfs
```

**Client**
```console
# mkdir -p /backup
# mount 172.16.6.252:/backup/linux2XX /backup 
# tar cvzf /backup/home.tar.gz /home
```

### DNS + WEB + NFS 연동 실습
* 웹 서버 마운트 -> 웹 서버 설정 -> 웹서버 실행
* www 도메인에 여러개의 IP를 설정  

## SAMBA(CIFS/SMB) Server on Cent OS 7.X 
* Program: samba, samba-client
* Daemon & Port & Protocol: smbd(139/tcp, 445/tcp), nmbd(137/udp, 138/udp)
* Configuration File(s): /etc/samba/smb.conf 
* Sub Configuration File(s): /etc/samba/*
* Service: smb.service

### 초기설정
```console
# yum install samba samba-client cifs-utils
# cd /etc/samba
# mv smb.conf smb.conf.old
# cp -p smb.conf.example smb.conf
# vi smb.conf
```

### SAMBA 서버 설정
1. 패키지 설치 `# yum install samba samba-client`
1. 서버 설정 `# vi /etc/samba/smb.conf`
    ```
    # mkdir -p /share
    # chcon -t samba_Share_t /share
    # semanage fcontext -a -t samba_share_t '/share(/.*)?'
    # vi /etc/samba/smb.conf
    ```
1. 서비스 기동 `# systemctl enable smb; systemctl start smb`
1. 방화벽 등록 `# firewall-cmd --permanent --add-service=samba; firewall-cmd --reload`
1. SELInux 설정 (chcon CMD, semanage fcontext CMD)
 
### SAMBA 관련 명령어
**smbclient**
```console
# smbclient -L IP -N
# smbclient //IP/share -U user%pass
# smbclient -L IP -U user%pass
```
**testparm**
```
# testparm -s
# testparm -s -v
```
**mount CMD**

### 리눅스 서버(공유) --> 윈도우 서버(접근)
* 윈도우 서버 방화벽은 내려간 상태 (firewall.cpl)
* 윈도우 서버 soldesk 사용자와 암호 
* 공유 검색 허용

> linux Server

```console
# mkdir -p -m 777 /samba
# vi /etc/samba/smb.conf
> [public]
# useradd -s /sbin/nologin -M soldesk
# smbpasswd -a soldesk (# pdbedit -L, 확인)
# systemctl restart/enable smb
```

### (공유)Windows10 --> Linux (접근)
> on Windows

* mkdir `c:\samba_share`
* c:\samba_share > 속성 > 공유
    - everyone(모든 권한)
    - soldesk 추가(모든 권한)
* 제어판 > 프로그램 > 프로그램 및 기능 > Windows 기능 켜기/끄기

> on Linux<br>

```console
# mkdir -p /mnt/server
# mount -t cifs -o username=soldesk,password=soldesklove //172.16.6.24/samba_share /mnt/server
# vi /etc/fstab
> //172.16.6.x/samba_share /mnt/server cifs sec=ntlmssp,credentials=/etc/samba/users 0 0
# vi /etc/samba/users
username=soledesk
password=soldesklove
# chmod 600 /etc/samba/users
```

> 정리

**리눅스 서버 공유**
```console
# mkdir -p /samba
# useradd -s /sbin/nologin -M soldesk ; smbpasswd -a soldesk
# vi /etc/samba/smb.conf
# systemctl restart smb
```

**윈도우 서버 공유**
```
네트워크 및 공유센터 > 고급 공유 설정 변경
C:\samba 폴더 생성
폴더 속성 > 공유 탭 > 공유 설정
```

**리눅스 서버 마운트**
```
(임시) mkdir -p /mnt/server ; mount.cifs -o username=soldesk,password=soldesklove //172.16.6.X/samba /mnt/server
(영구) vi /etc/fstab
      //172.16.6.X/samba    /mnt/server cifs    sec=ntlmssp,credentials=/etc/samba/users 0 0
```

**윈도우 서버 마운트**
```
(임시) \\172.16.6.X\public
(영구) 네트워크 드라이브 연결
```

### linux2XX 서버 --> linux1XX 서버
> linux2XX Server

```console
# useradd -s /sbin/nologin -M soldesk
# mkdir -p /samba
# smbpasswd -a soldesk
# vi /etc/samba/smb.conf
# systemctl restart smb
```

> linux1XX Server

```console
# yum install samba-client cifs-utils
# mount.cifs //172.16.6.X   /mnt/server -o username=soldesk
# vi /etc/fstab
//172.16.6.2XX/public /mnt/server credentials=/root/users 0 0
# vi users
username=soldesk
password=soldesklove
# chmod 600 users
```
