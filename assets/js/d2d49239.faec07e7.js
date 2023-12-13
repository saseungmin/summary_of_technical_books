"use strict";(self.webpackChunkreading_books_record_repository=self.webpackChunkreading_books_record_repository||[]).push([[1850],{1837:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>i,contentTitle:()=>a,default:()=>p,frontMatter:()=>o,metadata:()=>c,toc:()=>l});var r=n(5893),s=n(1151);const o={sidebar_position:8,sidebar_label:"7. \uc0ac\uacfc\uc640 \uc624\ub80c\uc9c0"},a="\ud83c\udf08 Chapter 7: \uc0ac\uacfc\uc640 \uc624\ub80c\uc9c0",c={id:"test/test-driven-development/chapter-7",title:"\ud83c\udf08 Chapter 7: \uc0ac\uacfc\uc640 \uc624\ub80c\uc9c0",description:"\uc2e4\ud328\ud55c\ub2e4. Dollar\uac00 Franc\uc774\ub77c\ub294\uad70. \ub3d9\uce58\uc131 \ucf54\ub4dc\uc5d0\uc11c\ub294 Dollar\uac00 Franc\uacfc \ube44\uad50\ub418\uc9c0 \uc54a\ub294\uc9c0 \uac80\uc0ac\ud574\uc57c \ud55c\ub2e4. \ub450 \uac1d\uccb4\uc758 \ud074\ub798\uc2a4\ub97c \ube44\uad50\ud568\uc73c\ub85c\uc368 \uc774\ub7ec\ud55c \uac80\uc0ac\ub97c \uc27d\uac8c \uc218\ud589\ud560 \uc218 \uc788\ub2e4. \uc624\uc9c1 \uae08\uc561\uacfc \ud074\ub798\uc2a4\uac00 \uc11c\ub85c \ub3d9\uc77c\ud560 \ub54c\ub9cc \ub450 Money\uac00 \uc11c\ub85c \uac19\uc740 \uac83\uc774\ub2e4.",source:"@site/docs/test/test-driven-development/chapter-7.md",sourceDirName:"test/test-driven-development",slug:"/test/test-driven-development/chapter-7",permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-7",draft:!1,unlisted:!1,editUrl:"https://github.com/saseungmin/reading_books_record_repository/tree/master/docs/test/test-driven-development/chapter-7.md",tags:[],version:"current",sidebarPosition:8,frontMatter:{sidebar_position:8,sidebar_label:"7. \uc0ac\uacfc\uc640 \uc624\ub80c\uc9c0"},sidebar:"sidebar",previous:{title:'6. \ub3cc\uc544\uc628 "\ubaa8\ub450\ub97c \uc704\ud55c \ud3c9\ub4f1"',permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-6"},next:{title:"8. \uac1d\uccb4 \ub9cc\ub4e4\uae30",permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-8"}},i={},l=[];function d(e){const t={code:"code",h1:"h1",p:"p",pre:"pre",...(0,s.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(t.h1,{id:"-chapter-7-\uc0ac\uacfc\uc640-\uc624\ub80c\uc9c0",children:"\ud83c\udf08 Chapter 7: \uc0ac\uacfc\uc640 \uc624\ub80c\uc9c0"}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-java",children:"public void testEquality() {\n  assertTrue(new Dollar(5).equals(new Dollar(5)));\n  assertFalse(new Dollar(5).equals(new Dollar(6)));\n  assertTrue(new Franc(5).equals(new Franc(5)));\n  assertFalse(new Franc(5).equals(new Franc(6)));\n  assertFalse(new Franc(5).equals(new Dollar(5)));\n}\n"})}),"\n",(0,r.jsxs)(t.p,{children:["\uc2e4\ud328\ud55c\ub2e4. ",(0,r.jsx)(t.code,{children:"Dollar"}),"\uac00 ",(0,r.jsx)(t.code,{children:"Franc"}),"\uc774\ub77c\ub294\uad70. \ub3d9\uce58\uc131 \ucf54\ub4dc\uc5d0\uc11c\ub294 ",(0,r.jsx)(t.code,{children:"Dollar"}),"\uac00 ",(0,r.jsx)(t.code,{children:"Franc"}),"\uacfc \ube44\uad50\ub418\uc9c0 \uc54a\ub294\uc9c0 \uac80\uc0ac\ud574\uc57c \ud55c\ub2e4. \ub450 \uac1d\uccb4\uc758 \ud074\ub798\uc2a4\ub97c \ube44\uad50\ud568\uc73c\ub85c\uc368 \uc774\ub7ec\ud55c \uac80\uc0ac\ub97c \uc27d\uac8c \uc218\ud589\ud560 \uc218 \uc788\ub2e4. \uc624\uc9c1 \uae08\uc561\uacfc \ud074\ub798\uc2a4\uac00 \uc11c\ub85c \ub3d9\uc77c\ud560 \ub54c\ub9cc \ub450 ",(0,r.jsx)(t.code,{children:"Money"}),"\uac00 \uc11c\ub85c \uac19\uc740 \uac83\uc774\ub2e4."]}),"\n",(0,r.jsx)(t.pre,{children:(0,r.jsx)(t.code,{className:"language-java",children:"public boolean equals(Object object) {\n  Money money = (Money) object;\n  return amount == money.amount && getClass().equals(money.getClass());\n}\n"})}),"\n",(0,r.jsx)(t.p,{children:"\ubaa8\ub378 \ucf54\ub4dc\uc5d0\uc11c \ud074\ub798\uc2a4\ub97c \uc774\ub7f0 \uc2dd\uc73c\ub85c \uc0ac\uc6a9\ud558\ub294 \uac83\uc740 \uc880 \uc9c0\uc800\ubd84\ud574 \ubcf4\uc778\ub2e4. \uc790\ubc14 \uac1d\uccb4\uc758 \uc6a9\uc5b4\ub97c \uc0ac\uc6a9\ud558\ub294 \uac83\ubcf4\ub2e4 \uc7ac\uc815 \ubd84\uc57c\uc5d0 \ub9de\ub294 \uc6a9\uc5b4\ub97c \uc0ac\uc6a9\ud558\uace0 \uc2f6\ub2e4. \ud558\uc9c0\ub9cc \ud604\uc7ac\ub294 \ud1b5\ud654 \uac1c\ub150 \uac19\uc740 \uac8c \uc5c6\uace0, \ud1b5\ud654 \uac1c\ub150\uc744 \ub3c4\uc785\ud560 \ucda9\ubd84\ud55c \uc774\uc720\uac00 \uc5c6\uc5b4 \ubcf4\uc774\ubbc0\ub85c \uc7a0\uc2dc \uc774\ub300\ub85c \ub450\uc790."}),"\n",(0,r.jsxs)(t.p,{children:["\uc774\uc81c \uc815\ub9d0 \uacf5\ud1b5 ",(0,r.jsx)(t.code,{children:"times()"})," \ucf54\ub4dc\ub97c \ucc98\ub9ac\ud574\uc57c \ud560 \ub54c\ub2e4. \ub530\ub77c\uc11c \ud63c\ud569\ub41c \ud1b5\ud654 \uac04\uc758 \uc5f0\uc0b0\uc5d0 \ub300\ud574 \ub2e4\ub8e8\uc5b4\uc57c \ud55c\ub2e4."]})]})}function p(e={}){const{wrapper:t}={...(0,s.a)(),...e.components};return t?(0,r.jsx)(t,{...e,children:(0,r.jsx)(d,{...e})}):d(e)}},1151:(e,t,n)=>{n.d(t,{Z:()=>c,a:()=>a});var r=n(7294);const s={},o=r.createContext(s);function a(e){const t=r.useContext(o);return r.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function c(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:a(e.components),r.createElement(o.Provider,{value:t},e.children)}}}]);