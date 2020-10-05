---
layout: post
title: "리눅스 네트워크 관리 - 네트워크 설정"
date: 2020-09-22 09:30:00 +0900
categories: dev
tags: linux  
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
nmcli를 통한 네트워크 제어
<!--more-->

* toc
{:toc .large-only}

# 서비스제어

|        legecy       |       | current |
| :---------------   | :---- | :------------- |
| xinetd service     | -->  | telnet.socket |
| standalone service | -->  | sshd.service |

```console
# systemctl enable telnet.socket
# systemctl restart telnet.socket

# systemctl enable sshd.service
# systemctl restart sshd.service
```

# 네트워크 설정관리
## 네트워크 설정 파일
* /etc/hosts
* /etc/host.conf (/etc/nsswitch.conf)
* /etc/resolv.conf
* /etc/sysconfig/network-scripts/ifcfg-* : 네트워크 카드의 설정 정보
* /etc/hostname: 자신의 서버이름 `# hostnamectl`

```
--------------- basic --------------
DEVICE="ens33"
NAME="ens33"
ONBOOT="yes"
UUID="73dc092f-4fb7-436b-82a2-e35ca9babb89"
USERCTL=yes
HWADDR="00:0C:29:3C:C4:E0"
--------------- static -------------
TYPE="Ethernet"
BOOTPROTO="none"
IPADDR="172.16.6.249"
PREFIX="24"
GATEWAY="172.16.6.254"
DNS1="168.126.63.1"
DOMAIN="example.com"
--------------- dhcp ---------------
BOOTPROTO="dhcp"
-------------------------------------	
```

{:.note title="/etc/sysconfig/network-scripts/ifcfg-*"}

```console
# vi /etc/sysconfig/network-scripts/ifcfg-ens33
# nmcli connection reload
# nmcli connection up ens33
```

## 네트워크 설정 명령어
* (CLI) nmcli CMD
* (TUI) nmtui
* (GUI) nm-connection-editor

* IP/NET -> ifconfig, ip address
* GW     -> netstat -nr, ip route
* DNS    -> cat /etc/resolv.conf

## 네트워크 작업(시나리오)
### IP 변경 작업
```console
# nmcli connection show ens33 | grep ipv4
# nmcli connection modify ens33 ipv4.addresses 172.16.6.1XX/24
# nmcli connection up ens33

# nmcli connection add help
# nmcli connention add \
> con-name ens33-new
> type ethernet
> ifname ethernet
> ifname ens33
> autoconnect yes
> ipv4 172.16.6.1XX/24 gw4 172.16.6.254

# nmcli connection up ens33-new

# nm-connection-editor &
# nmtui
```

### NIC 추가
```console
# poweroff
NIC 카드 장착(NAT)
# power on
# nmcli connection show '유선 연결 1'
# nmcli connection modify '유선 연결 1' \
> connection.id ens36 \
> connection.interface-name ens36 \
> ipv4.method manual \
> ipv4.addresses 192.168.10.2XX/24 

# nmcli connection up ens36
```

### TEAMING
**설정개요**
```
ens33(team0-port1, ens33)  --+-- team0(192.168.10.100) 
                             |
ens36(team0-port2, ens36)  --+
```

**전제 설정** ens33, ens36 disconnect

**Master 생성**
```console
# nmcli connection add \
> type team \
> ifname team0 \
> con-name team0 \
> config '{"runner":{"name":"activebackup"}}'
```
* activebackup: failover runner로 데이터 전송을 위한 링크를 감시하고 active port를 선택한다.
* loadbalance: 트래픽을 모니터링하고 패킷 전송에 대한 포트를 선택할 때 완벽한 균형에 도달하기 위해 hash function을 사용한다.
* lacp: 802.3ad(LACP)
* broadcast: simple runner로 모든 포트로 각각의 패킷을 전송
* roundrobin: simple runner로 각 포트에 라운드 로빈 방식으로 각각의 패킷을 전송

**Slave 생성**
```console
# nmcli connection add \
> type team-slave \
> ifname ens33[36] \
> con-name team0-port1 \
> autoconnect yes \
> master team0 
```

**Master Network Config**
```console
# nmcli connection modify team0 ipv4.method manual ipv4.addresses 192.168.10.100/24 \
> ipv4.gateway 192.168.10.2 ipv4.dns 168.126.63.1 ipv4.dns-search example.com
# nmcli connection up team0
# systemctl restart NetwrokManager
# teamdctl team0 state
```

**teaming 제거**
```console
# teamdctl
# teamdctl team0 state
# teamdctl team0 port remove ens33[36]

# nmcli connection delete team0
# nmcli connection delete team0-port1
# nmcli connection delete team0-port2
```
