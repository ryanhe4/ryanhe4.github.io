---
layout: post
title: "리눅스 서버 관리4 - 부팅과정"
date: 2020-09-17 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
리눅스 시스템 부팅과정 정리입니다.
<!--more-->

* toc part
{:toc .large-only}

## 부팅과정
리눅스 시스템에서의 부팅과정은 firmware-부트로드-커널-systemd 단계로 진행됩니다.

### firmware 단계
* POST (Power On Self Test)
* 부팅장치 순서 결정(e.g. Disk -> Removable Device -> CD -> Net)

### 부트로드(GRUB) 단계
* /etc/default/grub -- grub2-mkconfig --> /boot/grub2/grub.cfg (명령어를 통한 생성)<br>
/etc/grub.d/*
**grub2-mkconfig CMD**
```console
# grub2-mkconfig -o /boot/grub2/grub.cfg
```

**grub2-install CMD**
```console
# grub2-install /dev/sda
```

**grub2-setpassword CMD** 
```console
# grub2-setpassword          //설정
# rm -f /boot/grub2/user.cfg //삭제
```

### 커널(Kernel) 단계
* /boot/vmlinuz*
* /etc/sysctl.conf
* sysctl CMD
```console
# sysctl -w net.ipv4.ip_forward=1
# vi /etc/sysctl.conf
net.ipv4.ip_forward = 1
or
# vi /etc/sysctl.conf
net.ipv4.ip_forward = 1
# sysctl -p
```   

### systemd 단계
* systemd 특성 
    - 단일 체계 관리
* systemctl CMD을 통한 system daemon 관리

**서비스 확인**
```console
# systemctl list-unit-files | grep sshd
# systemctl -t help
# systemctl list-units -t service|socket|target
```

**서비스 제어**
```console
# systemctl start|stop|restart|reload sshd
# systemctl status sshd [-l, 상세정보]
# systemctl is-enabled-active|is-failed sshd
# systemctl --failed [--type=service]
```

**서비스 의존성 관계**
```console
# systemctl list-dependencies sshd
# systemctl list-dependencies sshd --reverse
```

**mast/unmask**
```console
# systemctl mask network
# systemctl mask iptables
# systemctl mask sendmail
```

**target**<br>
이전글에 봤던 [run level](https://xploitdev.com/dev/linux-essential-1.html)에 관련된 기능입니다. GUI 또는 TUI 등을 선택할 수 있습니다.  
```console
# systemctl get-default
# systemctl set-default multi-user.target|graphical.target
# systemctl isolate multi-user.target | graphical.target
```

**부팅과정에서 문제가 생기는 경우 제어**
어느 시점에서 문제가 생기는지에 따라서 작업 내용이 달라집니다. 문제 시점의 파악이 중요합니다.

1. rd.braek => /etc/share (root 암호 초기화)
```console
# mount -o remount, rw /sysroot
# chroot /sysroot
```
2. init=/bin/bash
```console
# mount -o remount,rw / 
```
3. systemd.unit=emergency.target => /etc/fstab
```console
# mount -o remount, rw /
```
4. systemd.unit=rescue.target => /etc/fstab

**/etc/rc.d/rc.local (etc/rc.local)**
```console
# chmod +x /etc/rc.d/rc.local
# vi /etc/rc.d/rc.local
```

#### 부팅 장애처리 시 참고사항
```console
# dmesg | more
# journalctl -xn
# systemctl enable debug-shell.service (TTY9: ctrl + alt + f9)
# systemctl disable debug-shell.service
```

**중단된 작업 확인**<br>
실행 도중 완료가 되지 못하고 일부만 실행되어 전체 작업이 실행되지 못한 경우 -> `waiting` 상태 확인
```console
# systemctl list-jobs
```
* failed: systemctl --failed 
* waiting: systemctl list-jobs

**GRUB 영역 깨진경우 복구**
* /boot/grub2/grub.cfg 이상 
```console
# grub2-mkconfig -o /boot/grub2/grub.cfg
```
* `DISK 내의 GRUB 영역`이 깨진 경우
```console
# dd if=/dev/zero of=/dev/sda bs=446 count=1
# reboot
CD 부팅
# chroot /mnt/sysimage
# cat /boot/grub2/grub.cfg
# fdisk -l /dev/sda
# grub2-install /dev/sda
# exit ; exit
```

**/etc/fstab 파일 이상**

```console
! ls -l /dev/vg1/lv1
! ls -l /lv1
! tune2fs -l /dev/vg1/lv1, xfs_info /dev/vg1/lv1

# mount -o remount,rw /
# vi /etc/fstab
# systemctl daemon-reload
# exit
```

#### 새로운 서비스 등록 방법
* [eg.] oracle 관리자/was 관리자
    -> 운영체제가 부팅하면서 was/oracle 소프트웨어를 시작해야할 때
* 소스 컴파일 (/usr/local/apache2)

```console
# /usr/lcoal/apache2/bin/apachectl restart
# systemctl enable apache2
# systemctl restart apache2

# vi /usr/lib/systemd/system/new.service
# systemctl enable new.service
# systemctl restart new.service

# systemctl stop new.service
# systemctl disable new.service
# rm -f /usr/lib/systemd/system/new.service
```

**/root/bin/new**
* 서비스 등록할 프로그램을 생성합니다.
```bash
#!/bin/bash

echo -e "Test New Service is start." | logger -t TestNewService
while true
do
    echo -e "Test new service start"
    sleep 30
done
```

* 프로그램에 권한을 부여하고 서비스 파일생성 합니다
```console
# chmod 755 /root/bin/new
# /root/bin/new
<CTRL + C>
# cat /var/log/messages | grep TestNewService
# vi /usr/lib/systemd/system/new.service
```

```config
[Unit]
Description=Test New Service

[Service]
Type=simple
ExecStart=/root/bin/new
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
{:.note title="/usr/lib/systemd/system/new.service"}

**서비스 등록/실행**
```console
# systemctl enable new.service
# systemctl start new.service
# systemctl list-unit-files | grep new
# systemctl status new.service
```
