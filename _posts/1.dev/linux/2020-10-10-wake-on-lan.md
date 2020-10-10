---
layout: post
title: "Manjaro wol(Wake On Lan) 설정"
date: 2020-10-10 16:09:00 +0900
categories: dev
tags: linux
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
---
Manjaro Linux 시스템에서 Wake-On-Lan 사용법 정리 입니다.

<!--more-->

* toc
  {:toc .large-only}

## 하드웨어 설정
우선, 메인보드에서 WOL기능을 지원해야 합니다. 요즘은 대부분 지원하는듯 합니다.
BIOS에서 WOL 기능을 ON 시켜줘야 합니다. 해당 부분은 메인보드마다 다양하므로 검색을 통해서 설정하면 됩니다.

보통 `WOL` 또는 `PCIE POWER ON` 등의 이름으로 존재합니다. 

## 소프트웨어 설정
우선 `ethtool`을 통해 현재 자신의 장치 상태를 확인합니다. `ethtool`이 없을경우 설치해줍시다.
```console
# pacman -S ethtool
```
설치가 됐으면 다음 명령어를 통해 wol 설정을 확인할 수 있습니다.
```console
# ip a
# ethtool [interface] | grep Wake
```
```console
Supports Wake-on: pumbg
Wake-on: g
```
Wake-on 부분이 d나 다른 설정으로 되있을 경우 다음 명령어로 설정 해줍시다.
```console
# ethtool -s [interface] wol g 
```
해당 설정은 임시 설정이고, 컴퓨터 종료후 같은 네트워크 상에서 Wol 어플리케이션 이나 다른 컴퓨터를 통해 동작을 확인해봅시다.

저의 경우 r8168 드라이버를 사용하였는데, 추가적으로 `Kernel Parameter`를 설정해야 했습니다.
```console
# vi /etc/modprobe.d/r8168.conf
> options r8168 s5wol=1
> modinfo r8168
```

## Persistent Setting
다음은 WOL 설정이 부팅시마다 달라지는 경우 지속적으로 셋팅 유지 방법 입니다. 
여러가지 설정방법들이 있는데, 다음 설정들 중 선택해서 작동되는 부분으로 적용하시면 됩니다.

### systemd.link
다음과 같이 설정해주시면 됩니다.

/etc/sytstemd/network/50-wired.link
```coffeescript
[Match]
MACAddress=aa:bb:cc:dd:ee:ff

[Link]
NamePolicy=kernel database onboard slot path
MACAddressPolicy=persistent
WakeOnLan=magic
```
{:.note}

### udev
자신의 네트워크 인터페이스에 맞춰 설정해주시면 됩니다.

/etc/udev/rules.d/81-wol.rules
```coffeescript
ACTION=="add", SUBSYSTEM=="net", NAME=="enp*", RUN+="/usr/bin/ethtool -s $name wol g"
```
{:.note}

## TLP
자신의 시스템에서 TLP가 작동되고 있을경우 TLP의 기본설정에 의해서 WOL 기능이 종료될 수 있습니다. TLP설정 또한 해줍시다.

/etc/tlp.conf
```coffeescript
WOL_DISABLE=N
```
{:.note}


## 참고
[Wake-on-LAN](https://wiki.archlinux.org/index.php/Wake-on-LAN)
[Kernel_module#Setting_module_options](https://wiki.archlinux.org/index.php/Kernel_module#Setting_module_options)
