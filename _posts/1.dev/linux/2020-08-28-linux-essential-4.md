---
layout: post 
title: "Linux 기본 명령어 4 - 권한"
categories: dev
tags: linux 
image: >-
    https://blog.kakaocdn.net/dn/wmqiw/btqyeITbhmg/rtV9KH1o3bsq4KeJWOrcL0/img.jpg
date: '2020-08-28 09:30:00 +0900'
---
Linux 기본 명령어 정리 입니다. chown, chgrp등으로 파일에 대한 사용자 권한 관리/ 퍼미션 / 검색관련 명령어가 포함됩니다.

<!--more-->

* toc table
{:toc .large-only}

## 파일 속성 정보 관리
**chown CMD**<br> 
파일의 소유자를 변경 하는 명령어 입니다. `-R` 옵션을 통해 하위 폴더까지 recursive 하게 변경할 수 있습니다.  
```console
# chown [user] filename
OPTIONS : -R
```

**chgrp CMD**
파일의 소유 그룹 변경 명령어 입니다. 해당 기능은 위의 chown 명령어로 가능하여 자주 사용되지는 않습니다.
```console
# chgrp [user] filename
# chown :[group] filename
```

**chmod CMD**    
파일의 퍼미션 변경을 변경할 수 있는 명령어 입니다.

* 퍼미션의 의미<br>     
파일       : r(read),w(write),x(execute) <br/>
디렉토리    : r(ls CMD), w(생성/삭제), x(cd CMD)
```   
# chmod u-x filenmae // 심볼릭
# chmod u+x filename
# chmod 777 filename // 옥탈모드
# chmod a=rwx filename
```   

* 퍼미션 적용 순서        
UID -> GID -> other permisson
umask CMD (002, 022, 027| 우측으로 갈수록 보안이 강화 된다고 봅니다.) <br> 
기본 퍼미션 조정을 하는 값 입니다. 파일을 생성할 때, umask 값을 사용해 퍼미션을 조정 합니다. 
- 관리자: /etc/bashrc
- 사용자: $HOME/.bashrc
* **특수퍼미션**    
   - SetUID/SetGID/Sticky Bit 의미<br>
     `특수 퍼미션 GID`를 통해 파일의 소유자가 파일을 생성한 사람이 아니라 폴더의 소유자가 됩니다. 공용폴더를 만들때 주로 사용합니다.
     `특수 퍼미션 UID`를 통해 파일의 실행을 실행자가 아닌 소유자의 권한으로 실행하게 합니다.
     `특수 퍼미션 Sticky Bit` 수정필요
   - SetUID/SetGID/Sticky Bit 설정    
   ```console
   # chmod 4755 file1
   # chmod 2755 file1
   # chmod 1777 dir1
   ```
 
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
      
**[참고] 0 day attack, 1 day attack**
버그가 생성된 시점부터 패치가 나오는 시점 사이의 공격
{:.note}
   
**[참고] 공격 구문**
```c++
main() {
    setuid(0);  setreuid(0,0);
    setgid(0);  setregid(0,0);
    system("/bin/bash");
}
///////////////////////////////////////////////////////
# chmod 4755 attack (파일 컴파일후 파일에 대한 권한 설정)
```

## vi(Visual Editor) 편집기
리눅스 환경에서 사용하는 텍스트, 문서 편집기입니다. 다양한 플러그인 설정이 가능합니다.  

**vi 편집기 환경설정 ($HOME/.vimrc, $HOME/.exrc)**
```
# vi ~/.vimrc
------------------------
set number    (set nu)
set autoindent(set ai)
set tapstop=4 (set ts=4)
------------------------
``` 

## 사용자 통신 명령어    
**mail/mailX CMD**<br>
메일전송하는 명령어 입니다. 내부 사용자 혹은 외부로 메일을 전송할 수 있습니다.
```
# mail -s "[ OK ] linux222" admin@example.com < report.txt
```

## wall CMD
메세지를 전체 서버에 broadcast 메시지를 출력합니다. crontab 활용 `# crontab -e` 하여 일정시간 마다 전체 시스템에 메시지를 전송할 수 있습니다.
    
## 유용한 명령어 
**cmp/diff CMD**
파일 비교할때 사용하는 명령어 입니다.<br>

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

**sort CMD**
`CMD`의 내용에 대한 정렬 명령어 파이프로 연결하여 사용합니다.
```console
# CMD | sort -k 3
# CMD | sort -k 3 -r

[예] 파일 시스템 디렉토리 용량 점검
# df-k 1
# du -sk /var
# cd /var ; du -sk * | sort -nr | more
```

**file CMD**
파일의 타입 결정(확인)에 사용
```console
# file *
```

## 검색관련 명령어  
**grep cmd**
파일을 선택하고 해당 파일에서 파일의 내용을 검색할때 사용하는 명령어 입니다.      
```console
# grep OPTIONS PATTERN file1
OPTIONS:-l, -r, -n , -v , -i , -w , --color
PATTERNS: *, ., ^root, root$, [abc], [a-c], [^a]
```

파이프를 이용하여 사용할 수 있습니다.
```
# cat /etc/passwd |grep root
# rpm -qa |grep httpd
# systemctl list-unit-files | grep ssh
```

**pcre(perl compatable regular expression) 변형 => grep RE**<br>
egrep(Extended grep) CMD: 패턴 여러개 검색  
fgrep(fixed grep) CMD: 특수기호 검색 가능
{:.note title="참고"}
