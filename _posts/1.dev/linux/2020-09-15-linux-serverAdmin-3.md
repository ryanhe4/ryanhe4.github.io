---
layout: post
title: "리눅스 서버 관리3 - 소프트웨어"
date: 2020-09-15 17:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
RPM, YUM, Source 등을 통한 리눅스 Software 관리 명령어 입니다.
<!--more-->

* toc part
{:toc .large-only}

## Software 관리
### RPM 패키지 관리
RPM(Redhat Package Manager): 레드헷이서 패키지를 좀 더 쉽게 설치하고 관리하기 위해 만든 패키지 관리 프로그램<br>
**rpm 패키지 다운로드 사이트**<br>
* [http://rpmfind.net](http://rpmfind.net)
* [http://rpm.pbone.net](http://rpm.pbone.net)

**패키지 설치**
```console
# rpm -ivh|Fvh|Uvh [--nodeps] [--force] A.rpm
```
* ivh : 패키지 업데이트, 이전 버전이면 업그레이드 하고 없으면 설치 
* Fvh : 패키지 업데이트, 이전 버전의 패키지가 있을 경우만 패키지를 설치
* Uvh : 패키지 업데이트, 이전 버전이면 업그레이드 하고 없으면 설치, 패키지 설치 시 가장 기본적으로 수행
 
**패키지 확인**
```console
# rpm -qa | grep bash
# rpm -qi bash
# rpm -ql bash
# rpm -qi -p PKG.rpm 
```

**패키지 삭제**
```console
rpm -e [--nodeps] PKG
```

**rpm 파일 구하는 곳**
* Linux CD
* 인터넷(fedoraproject)
```console
# yum install epel-release
# yum install ntfs-3g
```
* 개발자

**패키지 파일 이름 형식**<br>
`name`(이름)-`version`(버전)-`relese.architecture`(아키텍처).rpm

### YUM 패키지관리
패키지 의존성 관계에 의해 `rpm 명령어`를 통한 패키지 설치의 어려움이 존재하기 때문에 패키지 의존성 관계를 해결하고 효율적인 패키지 관리는 위해 `yum`이 등장하였다.

**패키지 확인**
```console
# yum list
# yum list "bash*" (# yum list | grep bash)
# yum info php
# yum search 단어
```

**yum history**<br>
yum 처리 기록을 확인, 특정시점으로 롤백/redo/undo 등의 작업을 할 수 있다. 
```console
# yum history
# yum history 15
# yum history info 15

# yum history undo 15
# yum history redo 15
# yum history rollback 5
```

**패키지 설치 & 업데이트**
```console
# yum -y update PKG
# yum -y install PKG

# yum check-update 2>&1 | tee -a yum.log
# yum check-update | grep kernel
# yum update        // OS 업데이트
# reboot
```

**yum localinstall**
* CD 안의 패키지 설치
* 인터넷에서 받은 패키지 설치
```console
# yum localinstall PKG.rpm
```

**`CDROM-CD`를 가지고 YUM Repository 구성**
* CD-ROM CD 장착(Automount) -> `/mnt/cdrom`
```
[CD]
name=MYCD Test
baseurl=file://mnt/cdrom
enabled=1
gpgcheck=0
```
{:.note title="/etc/yum.repos.d/CD.repo"}

**CD ISO 이미지를 가지고 YUM Repository 구성**

* `/test/CD.ISO` 파일 준비
```console
# mkdir -p /mnt/iso ;  mount -o loop /test/CD.iso /mnt/iso
```

```
[MYISO]
name=MYISO Test
baseurl=file://mnt/iso
enabled=1
gpgcheck=0
```
{:.note title="/etc/yum.repos.d/myiso.repo"}

**패키지 삭제**
```console
# yum remove|erase PKG
```

**yum 그룹**
```console
# yum group install GPKG
# yum group list
# yum group list hidden
# yum group info GPKG
```

**yumdownloader**

패키지를 바로 설치하지 않고 파일이나 소스 형태로 다운로드 하는 명령어 입니다.
```console
# yumdownloader PKG
# yumdownloader PKG --source
```

**자동으로 yum 업데이트/ 끄기**
```console
# yum -y install yum-cron
# systemctl start yum-cron
# systemctl enable yum-cron

# systemctl disable yum-cron
# systemctl stop yum-cron
```

### 소스 패키지 관리
* 파일 다운로드(e.g. httpd-*.tar.gz)
* 압축 해제(tar xvzf)
* configure && make && make install
* 서비스 기동 && 확인

* 소스 형태로 설치한 프로그램은 "rpm -qa | grep PKG" 목록에 나오지 않습니다.
* "rm -rf /usr/local/apache2" 지운 디렉토리 복원

```console
# cd /usr/local/src/httpd-*
# make install
``` 

**configure/make/ make install 다시 수행**
```console
# cd/usr/local/src/httpd-*
# ./configure
# make clean
# make && make install
```
