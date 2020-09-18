---
layout: post 
title: "Linux 기본 명령어 4"
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
date: '2020-08-28 09:30:00 +0900'
image: assets/img/blog/steve-harvey.jpg
---
Linux 기본 명령어

<!--more-->

* toc table
{:toc}

# 파일 속성 정보 관리
## chown CMD
파일의 사용자 변경    
```console
# chown [user] filename
OPTIONS : -R
```
## chgrp CMD
파일의 그룹 변경(위의 chown 명령어로 가능하여 많이 사용되지 않음)
```console
# chgrp [user] filename
```

## chmod CMD    
파일의 퍼미션 변경
* **퍼미션의 의미**     
   파일       : r,w,x <br/>
   디렉토리    : r(ls CMD), w(생성/삭제), x(cd CMD)
    ```   
    # chmod u-x filenmae // 심볼릭
    # chmod u+x filename
    # chmod 777 filename // 옥탈 모드
    # chmod a=rwx filename
    ```    
* **퍼미션 적용 순서**        
  UID -> GID -> other permisson
  umask CMD (002, 022, 027| 우측으로 갈수록 보안 강화) <br> 
  기본 펑션 조정 파일을 생성할 때, 퍼미션을 조정하는 값 
  - 관리자: /etc/bashrc
  - 사용자: $HOME/.bashrc
* **특수퍼미션**    
   - SetUID/SetGID/Sticky Bit 의미
   - SetUID/SetGID/Sticky Bit 설정    
   ```console
   # chmod 4755 file1
   # chmod 2755 file1
   # chmod 1777 dir1
   ```
   - SetUID/SetGID/Sticky Bit 관리
            
* **검색 방법** 
```console
# find / \( -perm -4000 -o -perm -2000\) -type f
```
* **목록화 방법/카운터**
```console
# find / \( -perm -4000 -o -perm -2000 \) > setuid.txt
# find / \( -perm -4000 -o -perm -2000 \) | wc -l > setuid.txt
# diff setuid.txt setuid.old.txt
```
* **관리 방법**       
```
# chmod 755 /usr/bin/passwd 
# find /home -type f -perm -4000 -exec rm -f {} \;
```
      
>**[참고] 0 day attack, 1 day attack**<br>
버그가 생성된 시점부터 패치가 나오는 시점 사이의 공격
   
>**[참고] 공격 구문**

```c++
main() {
    setuid(0);  setreuid(0,0);
    setgid(0);  setregid(0,0);
    system("/bin/bash");
}
///////////////////////////////////////////////////////
# chmod 4755 attack (파일 컴파일후 파일에 대한 권한 설정)
```

# vi(Visual Editor) 편집기
리눅스 환경에서 사용하는 텍스트, 문서 편집기 
## vi 편집기 환경설정 ($HOME/.vimrc, $HOME/.exrc)

```
# vi ~/.vimrc
------------------------
set number    (set nu)
set autoindent(set ai)
set tapstop=4 (set ts=4)
------------------------
``` 

# 사용자 통신 명령어    
## mail/mailX CMD
```
# mail -s "[ OK ] linux222" admin@example.com < report.txt
```

## talk CMD
## wall CMD
메세지를 전체 서버에 broadcast, crontab 활용 ```# crontab -e```
    
# 유용한 명령어
## cmp/diff CMD
 
* 파일 비교할때 사용하는 명령어<br>
 백업 설정 파일, 현재 설정 파일 비교 
```console
# diff httpd.conf httpd.conf.old
```
* Migration 확인 작업(# cp -a) 
```console
# find /was1 | wc -l
# find /was2 | wc -l
=============================
# diff --recursive /was1 /was2
```

## sort CMD
CMD의 내용에 대한 정렬 명령어
```console
# CMD | sort -k 3
# CMD | sort -k 3 -r
[예] 파일 시스템 디렉토리 용량 점검
# df-k 1
# du -sk /var
# cd /var ; du -sk * | sort -nr | more
```

##file CMD
**파일의 타입 결정(확인)에 사용**
```console
# file *
```

# 검색관련 명령어  
## grep cmd
     
```console
# grep OPTIONS PATTERN file1
OPTIONS:-l, -r, -n , -v , -i , -w , --color
PATTERNS: *, ., ^root, root$, [abc], [a-c], [^a]
```
```
# cat /etc/passwd |grep root
# rpm -qa |grep httpd
# systemctl list-unit-files | grep ssh
```

>**[참고] pcre(perl compatable regular expression) 변형 => grep RE**<br>

* **egrep(Extended grep) CMD** : 패턴 여러개 검색  
* **fgrep(fixed grep) CMD** : 특수기호 검색 가능