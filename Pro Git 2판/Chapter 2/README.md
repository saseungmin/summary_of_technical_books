# 🌈 Chapter 2: Git의 기초

## 🦄 Git 저장소 만들기

### 🐣 기존 디렉터리를 Git 저장소로 만들기
  
```bash
> git init
```
- 이 명령은 `.git`이라는 하위 디렉터리를 만든다. 이 디렉터리는 저장소에 필요한 뼈대 파일이 들어있다.
- Git이 파일을 관리하게 하려면 저장소에 파일을 추가하고 커밋해야 한다.

```bash
> git add *.c // 파일을 추가
> git add LICENSE // 파일을 추가
> git commit -m 'initial project version' // 커밋
```

### 🐣 기존 저장소를 Clone 하기
- 다른 프로젝트에 참여하거나(contribute) Git 저장소를 복사하고 싶을 때 `git clone` 명령을 사용한다.
- Git이 SVN과 가장 큰 차이점은 ㅅ버에 있는 거의 모든 데이터를 복사한다.
- `git clone`을 실행햐면 프로젝트 히스토리를 전부 받아온다.

```bash
> git clone [url]
```

- 저장소의 데이터를 모두 가져와서 자동으로 가장 최신 버전을 `checkout` 해 놓는다.

```bash
> git clone [url] [디렉터리 명] // 디렉터리 명을 변경할 수 있다.
```

## 🦄 수정하고 저장소에 저장하기
- 파일을 수정하다가 저장하고 싶으면 **스냅샷을 커밋**한다.
- 워킹 디렉터리의 모든 파일은 크게 **Tracked**(관리대상임)와 **Untracked**(관리대상이 아님)로 나눈다.
- Tracked 파일은 이미 스냅샷에 포함돼 있던 파일이고 Tracked 파일은 또 **Unmodified**(수정하지 않음)와 **Modified**(수정함) 그리고 **Staged**(커밋으로 저장소에 기록할) 상태 중 하나이다.
- 처음에 저장소를 `Clone`하면 모둔 파일은 `Tracked`이면서 `Unmodified` 상태이다. 이후 어떤 파일을 수정하면 Git은 그 파일을 `Modified` 상태로 인식한다.
- 실제로 수정한 파일을 `Staged` 상태로 만들고, `Staged` 상태의 파일을 커밋한다. (사이클 반복)

### 🐣 파일의 상태 확인하기
- 파일 상태를 확인하려면 `git status` 명령을 사용한다.

```bash
> git status
```

- 프로젝트에 README 파일을 만들면 README 파일은 새로 만든 파일이기 때문에 `git status`룰 실행하면 `Untracked files`에 들어 있다.
- Untracked 상태는 아직 스냅샷(커밋)에 넣어지지 않는 파일이다.

### 🐣 파일 새로 추적하기
- `git add` 명령으로 파일을 새로 추적할 수 있다.

```bash
> git add README
```

- 그 후 `git status` 명령을 다시 실행하면  Tracked 상태이면서 커밋에 추가될 Staged 상태라는 것을 확인할 수 있다.
- 커밋하면  `git add`를 실행한 시점의 파일이 커밋되어 저장소 히스토리에 남는다.

### 🐣 Modified 상태의 파일을 Stage하기
- 이미 Tracked 상태인 파일을 수정하면 `Changes not staged for commit`에 있다.

```bash
❯ git status
현재 브랜치 pro-git-chapter-2 브랜치가 'origin/master'에 맞게 업데이트된 상태입니다.

커밋하도록 정하지 않은 변경 사항:
  (무엇을 커밋할지 바꾸려면 "git add <파일>..."을 사용하십시오)
  (use "git restore <file>..." to discard changes in working directory)
        수정함:        "Pro Git 2\355\214\220/Chapter 1/README.md"
```
- 이 상태는 수정한 파일이 Tracked 상태이지만 아직 Staged 상태는 아니라는 점이다.
- Staged 상태로 만들기 위해서는 `git add` 명령을 실행해야 한다.
- `git add`후 해당 파일을 다시 수정하면 그 파일의 상태는 Staged 상태이면서 동시에 Unstaged 상태로 나오게 된다. 이렇게 되는 이유는 `git commit`은 실행하는 시점의 버전이 커밋되는 것이 아니라 마지막으로 `git add` 명령을 실행했을 때의 버전이 커밋된다. 그렇기 때문에 최신 상태로 반영하기 위해서는 다시 `git add` 명령을 실행해서 최신 버전을 Staged 상태로 만들어야 한다.

### 🐣 파일 상태를 짤막하게 확인하기
- `git status -s` 또는 `git status --short` 처럼 옵션을 주면 현재 변경한 상태를 짤막하게 보여준다.

```bash
> git status -s
M "Pro Git 2\355\214\220/Chapter 1/README.md"
?? "Pro Git 2\355\214\220/Chapter 2/"
```

- 아직 추적하지 않는 새 파일 앞에는 `??`표시가 붙는다.
- Staged 상태로 추가한 파일 중 새로 생성한 파일 앞에는 `A` 표시가, 수정한 파일 앞에는 `M`표시가 붙는다.
- `MM`이 붙는 경우는 해당 파일을 변경하고 Staged 상태로 추가한 후 또 내용을 변경해서 Staged이면서 Unstaged 상태인 파일이다.

### 🐣 파일 무시하기
- 로그 파일이나 빌드 시스템이 자동으로 생성하는 파일 같은 경우에는 Git이 관리할 필요가 없다.
- 이러한 파일을 무시하려면 `.gitignore` 파일을 만들고 그 안에 무시할 파일 패턴을 적는다.
- `.gitignore`파일은 보통 처음에 만들어 두는 것이 편리하다. 그래야 Git 저장소에 커밋하고 싶지 않은 파일을 실수로 커밋하는 일을 방지할 수 있다.
- `.gitignore` 파일에 입력하는 패턴은 아래 규칙을 따른다.

> 1. 아무것도 없는 라인이나, #로 시작하는 라인은 무시한다.
> 2. 표준 Glob 패턴을 사용한다.
> 3. 슬래시(/)로 시작하면 하위 디렉터리에 적용되지 않는다.
> 4. 디렉터리는 슬래시(/)를 끝에 사용하는 것으로 표현한다.
> 5. 느낌표(!)로 시작하는 패턴의 파일은 무시하지 않는다.

- `.gitignore` 예제 [참고](https://github.com/github/gitignore)

### 🐣 Staged와 Unstaged 상태의 변경 내용을 보기
- 어떤 내용이 변경됐는지 살펴보려면 `git status` 명령이 아니라 `git diff` 명령을 사용해야 한다.

```bash
> git diff
```
- 이 명령은 워킹 디렉터리에 있는 것과 Staging Area에 있는 것을 비교한다.
- 만약 커밋하려고 Staging Area에 넣은 파일의 변경 부분을 보고 싶으면 `git diff --staged` 옵션을 사용한다.
- `git diff` 명령은 마지막으로 커밋한 후에 수정한 것들 전부를 보여주지 않는다. `git diff`는 Unstaged 상태인 것들만 보여준다. 즉, **수정한 파일을 모두 Staging Area에 넣었다면 `git diff` 명령은 아무것도 출력하지 않는다.**
- Staged 상태인 파일은 `git diff --cached` 옵션으로 확인한다. `--staged`와 `--cached`는 같은 옵션이다.

### 🐣 변경사항 커밋하기
- Git은 생성하거나 수정하고나서 `git add` 명령으로 추가하지 않은 파일은 커밋하지 않는다.
- `git commit`을 실행하여 커밋한다.

```bash
> git commit
```
- 커밋을 하게 되면 Git 설정에서 지정된 편집기(Vim, Emacs)가 실행되고, 자동으로 텍스트가 자동으로 포함된다.
- 자동으로 생성되는 커밋 메시지의 첫 라인은 비어 있고 둘째 라인부터 `git status` 명령이 결과가 채워진다. (이 메시지는 삭제하거나 추가할 수 있다. `git commit -v`을 ㅎ게 되면 편집기에 `diff` 메시지가 추가된다.)
- 이렇게 커밋을 하게 되면 다음과 같이 출력되는데 아래 같은 경우는 `object-oriented-chapter-7` 브랜치에 커밋했고 체크섬은 `a742431`라고 알려준다.

```bash
❯ git commit
[object-oriented-chapter-7 a742431] [Update] object oriented chapter 7 link
 1 file changed, 7 insertions(+), 1 deletion(-)
```
### 🐣 Staging Area 생략하기
- Staging Area를 생략할려면 `git commit` 명령을 실행할 때 `-a` 옵션을 추가하면 Git은 Tracked 상태의 파일을 자동으로 Staging Area에 넣는다.

```bash
> git commit -a
```

### 🐣 파일 삭제하기
- Git에서 파일을 제거하려면 `git rm` 명령으로 Tracked 상태의 파일을 삭제한 후에 커밋해야 한다. 이 명령은 워킹 디렉터리에 있는 파일도 삭제하기 떄문에 실제로 파일도 지워진다.
- 커밋하면 파일은 삭제되고 Git은 이 파일은 더는 추적하지 앟는다.
- 이미 파일을 수정했거나, 수정한 파일을 Index에 추가했다면 `-f` 옵션을 주어 강제로 삭제해야 한다.
- 또한, Staging Area에서만 제거하고 워킹 디렉터리에 있는 파일은 지우지 않고 남겨둘려면 `--cached` 옵션을 사용한다.

```bash
> git rm --cached README
```

- 다음과 같이 여러 개의 디렉터리를 삭제할 수도 있다. (log/ 디렉터리에 있는 .log 파일을 모두 삭제한다.)

```bash
> git rm log\/*.log 
```

### 🐣 파일 이름 변경하기
- Git은 파일 이름의 변경이나 파일의 이동을 명시적으로 관리하지 않는다. 즉, 파일 이름이 변경됐다는 별도의 정보를 저장하지 않는다.
- 아래와 같이 파일 이름을 변경할 수 있다.

```bash
> git mv file_from file_to
```

- 위 `mv` 명령어는 아래 명령을 수행한 것과 완전히 동일하다.

```bash
> mv file_from file_to
> git rm file_from
> git add file_to
```

- `git mv`는 일종의 단축 명령어이다. Git의 `mv` 명령은 편리하게 명령을 세번 실행햐주는 것뿐이다.