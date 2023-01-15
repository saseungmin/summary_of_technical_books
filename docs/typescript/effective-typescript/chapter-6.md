---
sidebar_position: 7
sidebar_label: 6. 타입 선언과 `@types`
---

# 🐤 Chapter 6. 타입 선언과 `@types`

## 🥕 아이템 45. devDependencies에 typescript와 `@types`추가하기
npm(node package manager)은 세 가지 종류의 의존성을 구분해서 관리하며, 각각의 의존성은 package.json 파일 내의 별도 영역에 들어 있습니다.

- dependencies
현재 프로젝트를 실행하는 데 필수적인 라이브러리들이 포함됩니다. 프로젝트의 런타임에 lodash가 사용된다면 dependencies에 포함되어야 합니다.

- devDependencies
현재 프로젝트를 개발하고 테스트하는 데 사용되지만, 런타임에는 필요 없는 라이브러리들이 포함됩니다. 예를 들어, 프로젝트에서 사용 중인 테스트 프레임워크가 devDependencies에 포함될 수 있는 라이브러리입니다. 프로젝트를 npm에 공개하여 다른 사용자가 해당 프로젝트를 설치한다면, devDependencies에 포함된 라이브러리들은 제외됩니다.

- peerDependencies
런타임에 필요하기 하지만, 의존성을 직접 관리하지 않는 라이브러리들이 포힘됩니다.

타입스크립트는 개발 도구일 뿐이고 타입 정보는 런타임에 존재하지 않기 때문에 타입스크립트와 관련된 라이브러리는 일반적으로 devDependencies에 속합니다.   

모든 타입스크립트 프로젝트에서 공통적으로 고려해야 할 의존성 두 가지를 살펴보겠습니다.   
첫 번째, 타입스크립트 자체 의존성을 고려해야 합니다. 타입스크립트를 시스템 레벨로 설지할 수도 있지만 다음 두 가지 이유 때문에 추천하지는 않습니다.
- 팀원들 모두가 항상 동일한 버전을 설치한다는 보장이 없습니다.
- 프로젝트를 셋업할 때 별도의 단계가 추가됩니다.

따라서 타입스크립트를 시스템 레벨로 설치하기보다는 devDependencies에 넣는 것이 좋습니다.   

두 번째, 타입 의존성(`@types`)을 고려해야 합니다. 사용하려는 라이브러리에 타입 선언이 포함되어 있지 않더라도, [Definitely/Typed](https://github.com/DefinitelyTyped/DefinitelyTyped)에서 타입 정보를 얻을 수 있습니다.   

원본 라이브러리 자체가 dependencies에 있더라도 `@types` 의존성은 devDependencies에 있어야 합니다.
