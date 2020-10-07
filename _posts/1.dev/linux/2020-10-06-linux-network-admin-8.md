---
layout: post 
title: "리눅스 네트워크 관리 - DHCP"
date: 2020-10-06 15:37:00 +0900
categories: dev 
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
dhcp, dhcpd

<!--more-->

* toc table
{:toc .large-only}

> 용어

* 고정 IP/유동 IP
* 공인 IP/사설 IP

## DHCP(dhcpd) Server on Cent OS 7.X

* Program: dhcp
* Daemon & Port & Protocol: dhcpd(67/udp)
* Configuration File(s): /etc/dhcp/dhcpd.conf
* Sub Configuration File(s):
* Service: dhcpd.service

<hr/>

### DHCP 서버구성 (linux222) - 유동 IP 설정

```console
# yum install dhcp
# cp /usr/share/doc/dhcp-*/dhcpd.conf.example /etc/dhcp/dhcpd.conf
# vi /etc/dhcp/dhcpd.conf
```

**파일 설정**

```
option domain-name "linux2XX.example.com";
option domain-name-servers 192.168.10.2XX;
default-lease-time 600;
max-lease-time 7200;
authoritative;
log-facility local7;
subnet 172.16.6.0 netmask 255.255.255.0 {
}
subnet 192.168.10.0 netmask 255.255.255.0 {
  range 192.168.10.100 192.168.10.199;
  option domain-name-servers 192.168.10.2XX;
  option domain-name "linux2XX.example.com";
  option routers 192.168.10.2;
  option broadcast-address 192.168.10.255;
  default-lease-time 600;
  max-lease-time 7200;
}
```

**데몬 재기동**

```console
# systemctl enable dhcpd
# systemctl restart dhcpd
```

### DHCP Client 구성(linux1XX) - 유동IP

**서버 설정**

```console
# tail -f /var/log/messages | grep dhcpd
# cat /var/lib/dhcpd/dhcpd.leases
```

**클라이언트 설정**

```console
# cat /etc/sysconfig/network-scripts/ifcfg-ens36
# ip a
# ifdown ens33
# nm-connection-editor &
-> ens36 (dhcp)
# nmcli connection up ens36
# tail -f /var/log/messages
# cat /etc/sysconfig/network-scripts/ifcfg-ens36
```

### DHCP Server 구성(linux2XX) - 고정IP

```console
# cat /var/lib/dhcpd/dhcpd.lease
-> 클라이언 mac 주소 확인
# vi /etc/dhcp/dhcpd.conf
-----------------------------------
host linux1XX.example.com {
  hardware ethernet 00:0c:29:e0:ad:40;
  fixed-address 192.168.10.150;
}
-----------------------------------
# systemctl restart dhcpd
```

### DHCP 클라이언트 구성(linux1XX) - 고정IP

```console
# nmcli connection down ens36
# nmcli connection up ens36
# ip addr
# cat /etc/resolv.conf
# cat /etc/sysconfig/network-scripts/ifcfg-ens36-dhcp

(복원) linux1XX
# nmcli connection up ens33
# nmcli connection up ens36
# nmcli connection delete ens36-dhcp
```
