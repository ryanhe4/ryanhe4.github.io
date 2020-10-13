---
layout: post
title: "[Manjaro] Seafile Server 설치하기"
date: 2020-10-13 18:53:00 +0900
categories: dev
tags: linux
image: >-
https://www.unixmen.com/wp-content/uploads/2017/03/seafilelogo-800x445.jpg
---
`Seafile`은 웹 오픈소스 파일 공유 서비스 입니다. 설치와 설정이 간단합니다. Manjaro에 Seafile Server 설치를 해봅시다.
<!--more-->

* toc
  {:toc .large-only}

## 설치
설치는 다음 세개의 패키지를 설치해야합니다.
* aur/seafile-server
* aur/seahub
* mariadb

저는 `yay`를 통해 aur 패키지를 설치하였습니다. `yay`가 없는경우 설치할 수 있습니다.
```console
# pacman -S yay
```

### seafile-server
![Screenshot_20201013_193630](https://user-images.githubusercontent.com/47705875/95856540-252e1f80-0d95-11eb-9099-aa2529ce8dcb.png)

`seafile-server` 패키지를 `yay`를 통해 설치합니다. `seafile`은 7.1.5 버전 입니다.

```console
$ yay -S seafile-server
```
![Screenshot_20201013_194314](https://user-images.githubusercontent.com/47705875/95856725-763e1380-0d95-11eb-9f56-c1f33b9d02b2.png)

seafile-server는 `/usr/share/seafile-server` 에 설치됩니다. 

### seahub
`seahub` 패키지를 `yay`를 통해 설치합니다.

![Screenshot_20201013_194509](https://user-images.githubusercontent.com/47705875/95856837-a5ed1b80-0d95-11eb-9fb5-2ab437c15fbe.png)

```console
$ yay -S seahub
```

`seahub`는 `/usr/share/seafile-server/seahub` 에 설치됩니다. 

![Screenshot_20201013_194916](https://user-images.githubusercontent.com/47705875/95857010-e8aef380-0d95-11eb-925f-1069714183e1.png)

### mariadb
db에는 mariadb와 sqlite, postgresql 등을 사용할 수 있는 것 같습니다. 저는 mariadb를 설치했습니다.

**mariadb 패키지 설치**
```console
# pacman -S mariadb
```

**db install config** 
![Screenshot_20201013_200017](https://user-images.githubusercontent.com/47705875/95857278-54915c00-0d96-11eb-941e-6bb440a519d7.png)

```console
# mariadb-install-db --user=mysql --basedir=/usr --datadir=/var/lib/mysql
# mysql_secure_installation   // root 암호 설정
# systemctl start mariadb
```

### 설정
* `seafile-server`로 이동
```console
# cd /usr/share/seafile-server
```
* `mysql 설치 쉘` 실행, 암호, 포트 등을 설정할 수 있습니다. 저는 localhost로 설정했습니다. 
```console
# ./setup-seafile-mysql.sh 
```
* `seafile.sh` 실행
```console
# ./seafile.sh start
```
* `seahub.sh` 실행 / 처음 실행 시 관리자 계정 생성할 수 있습니다. 
```console
# ./seahub.sh start
```

이제 `localhost:8000`으로 접속할 수 있습니다.
![Screenshot_20201013_201105](https://user-images.githubusercontent.com/47705875/95858126-8d7e0080-0d97-11eb-8c06-8629ed061e20.png)

**접속화면** - 이전에 설정한 관리자 계정으로 접속합니다.
![Screenshot_20201013_201141](https://user-images.githubusercontent.com/47705875/95858130-8eaf2d80-0d97-11eb-935c-616d2b788b18.png)

**업로드**
![Screenshot_20201013_201222](https://user-images.githubusercontent.com/47705875/95858132-8f47c400-0d97-11eb-9d05-a24617b314ba.png)

<hr/>

## 참고
* [Arch Wiki: Seafile](https://wiki.archlinux.org/index.php/Seafile)
* [Arch Wiki: mariadb](https://wiki.archlinux.org/index.php/MariaDB)
* [Seafile Doc](https://download.seafile.com/published/seafile-manual/deploy/using_mysql.md)
