"use strict";(self.webpackChunkreading_books_record_repository=self.webpackChunkreading_books_record_repository||[]).push([[1907],{7953:(e,n,r)=>{r.r(n),r.d(n,{assets:()=>o,contentTitle:()=>i,default:()=>u,frontMatter:()=>t,metadata:()=>l,toc:()=>a});var s=r(5893),c=r(1151);const t={sidebar_position:11,sidebar_label:"10. \ud765\ubbf8\ub85c\uc6b4 \uc2dc\uac04"},i="\ud83c\udf08 Chapter 10: \ud765\ubbf8\ub85c\uc6b4 \uc2dc\uac04",l={id:"test/test-driven-development/chapter-10",title:"\ud83c\udf08 Chapter 10: \ud765\ubbf8\ub85c\uc6b4 \uc2dc\uac04",description:"\ub450 times() \uad6c\ud604\uc774 \uac70\uc758 \ube44\uc2b7\ud558\uae30 \ud558\uc9c0\ub9cc \uc544\uc9c1 \uc644\uc804\ud788 \ub3d9\uc77c\ud558\uc9c0\ub294 \uc54a\ub2e4.",source:"@site/docs/test/test-driven-development/chapter-10.md",sourceDirName:"test/test-driven-development",slug:"/test/test-driven-development/chapter-10",permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-10",draft:!1,unlisted:!1,editUrl:"https://github.com/saseungmin/reading_books_record_repository/tree/master/docs/test/test-driven-development/chapter-10.md",tags:[],version:"current",sidebarPosition:11,frontMatter:{sidebar_position:11,sidebar_label:"10. \ud765\ubbf8\ub85c\uc6b4 \uc2dc\uac04"},sidebar:"sidebar",previous:{title:"9. \uc6b0\ub9ac\uac00 \uc0ac\ub294 \uc2dc\uac04",permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-9"},next:{title:"11. \ubaa8\ub4e0 \uc545\uc758 \uadfc\uc6d0",permalink:"/reading_books_record_repository/docs/test/test-driven-development/chapter-11"}},o={},a=[];function d(e){const n={br:"br",code:"code",h1:"h1",li:"li",p:"p",pre:"pre",ul:"ul",...(0,c.a)(),...e.components};return(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)(n.h1,{id:"-chapter-10-\ud765\ubbf8\ub85c\uc6b4-\uc2dc\uac04",children:"\ud83c\udf08 Chapter 10: \ud765\ubbf8\ub85c\uc6b4 \uc2dc\uac04"}),"\n",(0,s.jsxs)(n.p,{children:["\ub450 ",(0,s.jsx)(n.code,{children:"times()"})," \uad6c\ud604\uc774 \uac70\uc758 \ube44\uc2b7\ud558\uae30 \ud558\uc9c0\ub9cc \uc544\uc9c1 \uc644\uc804\ud788 \ub3d9\uc77c\ud558\uc9c0\ub294 \uc54a\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Franc\nMoney times(int multiplier) {\n  return Money.franc(amount * multiplier);\n}\n\n// Dollar\nMoney times(int multiplier) {\n  return Money.dollar(amount * multiplier);\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"\uc774 \ub458\uc744 \ub3d9\uc77c\ud558\uac8c \ub9cc\ub4e4\uae30 \uc704\ud55c \uba85\ubc31\ud55c \ubc29\ubc95\uc774 \uc5c6\ub2e4. \ub54c\ub85c\ub294 \uc804\uc9c4\ud558\uae30 \uc704\ud574\uc11c \ubb3c\ub7ec\uc11c\uc57c \ud560 \ub54c\ub3c4 \uc788\ub294 \ubc95\uc774\ub2e4. \ud329\ud1a0\ub9ac \uba54\uc11c\ub4dc\ub97c \uc778\ub77c\uc778\uc2dc\ud0a4\uba74 \uc5b4\ub5a8\uae4c?"}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:'// Franc\nMoney times(int multiplier) {\n  return new Franc(amount * multiplier, "CHF");\n}\n\n// Dollar\nMoney times(int multiplier) {\n  return new Dollar(amount * multiplier, "USD");\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Franc"}),"\uc5d0\uc11c\ub294 \uc778\uc2a4\ud134\uc2a4 \ubcc0\uc218 ",(0,s.jsx)(n.code,{children:"currency"}),"\uac00 \ud56d\uc0c1 ",(0,s.jsx)(n.code,{children:"CHF"}),"\uc774\ubbc0\ub85c \ub2e4\uc74c\uacfc \uac19\uc774 \uc4f8 \uc218 \uc788\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Franc\nMoney times(int multiplier) {\n  return new Franc(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\uc798 \ub3cc\uc544\uac04\ub2e4. ",(0,s.jsx)(n.code,{children:"Dollar"}),"\ub3c4 \ub9c8\ucc2c\uac00\uc9c0\ub85c \uace0\uce60 \uc218 \uc788\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"Money times(int multiplier) {\n  return new Dollar(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Franc"}),"\uc744 \uac00\uc9c8\uc9c0 ",(0,s.jsx)(n.code,{children:"Money"}),"\ub97c \uac00\uc9c8\uc9c0\uac00 \uc815\ub9d0\ub85c \uc911\uc694\ud55c \uc0ac\uc2e4\uc778\uac00? \uc2dc\uc2a4\ud15c\uc5d0 \ub300\ud574 \uc544\ub294 \uc9c0\uc2dd\uc744 \uae30\ubc18\uc73c\ub85c \uc870\uc2ec\uc2a4\ub7fd\uac8c \uc0dd\uac01\ud574\ubcf4\uc544 \ud560 \ubb38\uc81c\ub2e4. \ud558\uc9c0\ub9cc \uc6b0\ub9ac\uc5d0\uac90 \uae54\ub054\ud55c \ucf54\ub4dc\uc640 \uadf8 \ucf54\ub4dc\uac00 \uc798 \uc791\ub3d9\ud560 \uac70\ub77c\ub294 \ubbff\uc74c\uc744 \uc904 \uc218 \uc788\ub294 \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub4e4\uc774 \uc788\ub2e4. \uba87 \ubd84 \ub3d9\uc548 \uace0\ubbfc\ud558\ub294 \ub300\uc2e0 \uadf8\ub0e5 \uc218\uc815\ud558\uace0 \ud14c\uc2a4\ud2b8\ub97c \ub3cc\ub824\uc11c \ucef4\ud4e8\ud130\uc5d0\uac8c \uc9c1\uc811 \ubb3c\uc5b4\ubcf4\uc790. TDD\ub97c \uac00\ub974\uce58\ub2e4\ubcf4\uba74 \ud56d\uc0c1 \uc774\ub7f0 \uc0c1\ud669\uc744 \ubcf4\uac8c \ub41c\ub2e4. \ucef4\ud4e8\ud130\ub77c\uba74 10\ucd08\uc5d0\uc11c 15\ucd08 \uc0ac\uc774\uc5d0 \ub300\ub2f5\ud560 \uc218 \uc788\ub294 \ubb38\uc81c\ub97c \ub193\uace0 \ucd5c\uace0\uc758 \uc18c\ud504\ud2b8\uc6e8\uc5b4 \uc5d4\uc9c0\ub2c8\uc5b4\ub4e4\uc774 5\ubd84\uc5d0\uc11c 10\ubd84 \ub3d9\uc548 \uace0\ubbfc\ud558\uace4 \ud55c\ub2e4. \uac00\ub054\uc740 \uadf8\ub0e5 \ucef4\ud4e8\ud130\uc5d0\uac8c \ubb3c\uc5b4\ubcf4\ub294 \uac83\ub3c4 \uc88b\ub2e4."]}),"\n",(0,s.jsxs)(n.p,{children:["\uc2e4\ud5d8\uc744 \uc2e4\ud589\ud558\uae30 \uc704\ud574 ",(0,s.jsx)(n.code,{children:"Franc.times()"}),"\uac00 ",(0,s.jsx)(n.code,{children:"Money"}),"\ub97c \ubc18\ud658\ud558\ub3c4\ub85d \uace0\uccd0\ubcf4\uc790."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Franc\nMoney times(int multiplier) {\n  return Money(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\ucef4\ud30c\uc77c\ub7ec\uac00 ",(0,s.jsx)(n.code,{children:"Money"}),"\ub97c \ucf58\ud06c\ub9ac\ud2b8 \ud074\ub798\uc2a4\ub85c \ubc14\uafd4\uc57c \ud55c\ub2e4\uace0 \ub9d0\ud55c\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Money\nclass Money {\n  Money times(int amount) {\n    return null;\n  }\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\ube68\uac04 \ub9c9\ub300\ub2e4. \uc5d0\ub7ec \uba54\uc2dc\uc9c0\uc5d0\ub294 \uae30\ub300\ub9cc\ud07c \ub3c4\uc6c0\uc774 \ub418\ub294 \uba54\uc2dc\uc9c0\uac00 \uc544\ub2cc \uac83 \uac19\ub2e4. \ub354 \ub098\uc740 \uba54\uc2dc\uc9c0\ub97c \ubcf4\uae30 \uc704\ud574 ",(0,s.jsx)(n.code,{children:"toString()"}),"\uc744 \uc815\uc758\ud558\uc790."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:'// Money\npublic String toString() {\n  return amount + " " + currency;\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:["\ud5c9! \ud14c\uc2a4\ud2b8\ub3c4 \uc5c6\uc774 \ucf54\ub4dc\ub97c \uc791\uc131\ud558\ub124? \uadf8\ub798\ub3c4 \ub418\ub294 \uac74\uac00? ",(0,s.jsx)(n.code,{children:"toString()"}),"\uc744 \uc791\uc131\ud558\uae30 \uc804\uc5d0 \ud14c\uc2a4\ud2b8\ub97c \uc791\uc131\ud558\ub294 \uac8c \ub9de\ub2e4. \ud558\uc9c0\ub9cc"]}),"\n",(0,s.jsxs)(n.ul,{children:["\n",(0,s.jsx)(n.li,{children:"\uc6b0\ub9b0 \uc9c0\uae08 \ud654\uba74\uc5d0 \ub098\ud0c0\ub098\ub294 \uacb0\uacfc\ub97c \ubcf4\ub824\ub358 \ucc38\uc774\ub2e4."}),"\n",(0,s.jsxs)(n.li,{children:[(0,s.jsx)(n.code,{children:"toString()"}),"\uc740 \ub514\ubc84\uadf8 \ucd9c\ub825\uc5d0\ub9cc \uc4f0\uc774\uae30 \ub54c\ubb38\uc5d0 \uc774\uac8c \uc798\ubabb \uad6c\ud604\ub428\uc73c\ub85c \uc778\ud574 \uc5bb\uac8c \ub420 \ub9ac\uc2a4\ud06c\uac00 \uc801\ub2e4."]}),"\n",(0,s.jsx)(n.li,{children:"\uc774\ubbf8 \ube68\uac04 \ub9c9\ub300 \uc0c1\ud0dc\uc778\ub370 \uc774 \uc0c1\ud0dc\uc5d0\uc11c\ub294 \uc0c8\ub85c\uc6b4 \ud14c\uc2a4\ud2b8\ub97c \uc791\uc131\ud558\uc9c0 \uc54a\ub294 \uac8c \uc88b\uc744 \uac83 \uac19\ub2e4."}),"\n"]}),"\n",(0,s.jsxs)(n.p,{children:[(0,s.jsx)(n.code,{children:"Franc"})," \ub300\uc2e0 ",(0,s.jsx)(n.code,{children:"Money"}),"\uac00 \uc654\ub2e4. \ubb38\uc81c\ub294 ",(0,s.jsx)(n.code,{children:"equals()"})," \uad6c\ud604\uc5d0 \uc788\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Money\npublic boolean equals(Object object) {\n  Money money = (Money) object;\n  return amount == money.amount && getClass().equals(money.getClass());\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\uc815\ub9d0\ub85c \uac80\uc0ac\ud574\uc57c \ud560 \uac83\uc740 \ud074\ub798\uc2a4\uac00 \uac19\uc740\uc9c0\uac00 \uc544\ub2c8\ub77c ",(0,s.jsx)(n.code,{children:"currency"}),"\uac00 \uac19\uc740\uc9c0 \uc5ec\ubd80\ub2e4."]}),"\n",(0,s.jsxs)(n.p,{children:["\ube68\uac04 \ub9c9\ub300\uc778 \uc0c1\ud669\uc5d0\uc11c\ub294 \ud14c\uc2a4\ud2b8\ub97c \ucd94\uac00\ub85c \uc791\uc131\ud558\uace0 \uc2f6\uc9c0 \uc54a\ub2e4. \ud558\uc9c0\ub9cc \uc9c0\uae08\uc740 \uc2e4\uc81c \ubaa8\ub378 \ucf54\ub4dc\ub97c \uc218\uc815\ud558\ub824\uace0 \ud558\ub294 \uc911\uc774\uace0 \ud14c\uc2a4\ud2b8 \uc5c6\uc774\ub294 \ubaa8\ub378 \ucf54\ub4dc\ub97c \uc218\uc815\ud560 \uc218 \uc5c6\ub2e4. \ubcf4\uc218\uc801\uc778 \ubc29\ubc95\uc73c\ub85c \ub530\ub974\uc790\uba74 \ubcc0\uacbd\ub41c \ucf54\ub4dc\ub97c \ub418\ub3cc\ub824\uc11c \ub2e4\uc2dc \ucd08\ub85d \ub9c9\ub300 \uc0c1\ud0dc\ub85c \ub458\uc544\uac00\uc57c \ud55c\ub2e4. \uadf8\ub7ec\uace0 \ub098\uc11c ",(0,s.jsx)(n.code,{children:"equals()"}),"\ub97c \uc704\ud574 \ud14c\uc2a4\ud2b8\ub97c \uace0\uce58\uace0 \uad6c\ud604 \ucf54\ub4dc\ub97c \uace0\uce60 \uc218 \uc788\uac8c \ub418\uace0, \uadf8 \ud6c4\uc5d0\uc57c \uc6d0\ub798 \ud558\ub358 \uc77c\uc744 \ub2e4\uc2dc \ud560 \uc218 \uc788\ub2e4.",(0,s.jsx)(n.br,{}),"\n","\uc774\ubc88\uc5d0\ub294 \ubcf4\uc218\uc801\uc73c\ub85c \ud574\ubcf4\uc790."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Franc\nMoney times(int multiplier) {\n  return new Franc(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\ub2e4\uc2dc \ucd08\ub85d \ub9c9\ub300\ub85c \ub3cc\uc544\uc654\ub2e4. \uc6b0\ub9ac \uc0c1\ud669\uc740 ",(0,s.jsx)(n.code,{children:'Franc(10, "CHF")'}),"\uacfc ",(0,s.jsx)(n.code,{children:'Money(10, "CHF")'}),"\uac00 \uc11c\ub85c \uac19\uae30\ub97c \ubc14\ub77c\uc9c0\ub9cc, \uc0ac\uc2e4\uc740 \uadf8\ub807\uc9c0 \uc54a\ub2e4\uace0 \ubcf4\uace0\ub41c \uac83\uc774\ub2e4. \uc6b0\ub9ac\ub294 \uc774\uac78 \uadf8\ub300\ub85c \ud14c\uc2a4\ud2b8\ub85c \uc0ac\uc6a9\ud560 \uc218 \uc788\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:'public void testDifferentClassEquality() {\n  assertTrue(new Money(10, "CHF").equals(new Franc(10, "CHF")));\n}\n'})}),"\n",(0,s.jsxs)(n.p,{children:["\uc608\uc0c1\ub300\ub85c \uc2e4\ud328\ud55c\ub2e4. ",(0,s.jsx)(n.code,{children:"equals()"})," \ucf54\ub4dc\ub294 \ud074\ub798\uc2a4\uac00 \uc544\ub2c8\ub77c ",(0,s.jsx)(n.code,{children:"currency"}),"\ub97c \ube44\uad50\ud574\uc57c \ud55c\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Money\npublic boolean equals(Object object) {\n  Money money = (Money) object;\n  return amount == money.amount && currency().equals(money.currency());\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\uc774\uc81c ",(0,s.jsx)(n.code,{children:"Franc.times()"}),"\uc5d0\uc11c ",(0,s.jsx)(n.code,{children:"Money"}),"\ub97c \ubc18\ud658\ud574\ub3c4 \ud14c\uc2a4\ud2b8\uac00 \uc5ec\uc804\ud788 \ud1b5\uacfc\ud558\uac8c \ud560 \uc218 \uc788\ub2e4."]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Franc\nMoney times(int multiplier) {\n  return new Money(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsxs)(n.p,{children:["\uc774\uac8c ",(0,s.jsx)(n.code,{children:"Dollar.times()"}),"\uc5d0\ub3c4 \uc801\uc6a9\ub420\uae4c?"]}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Dollar\nMoney times(int multiplier) {\n  return new Money(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"\uc798 \ub41c\ub2e4! \uc774\uc81c \ub450 \uad6c\ud604\uc774 \ub3d9\uc77c\ud574\uc84c\uc73c\ub2c8, \uc0c1\uc704 \ud074\ub798\uc2a4\ub85c \ub04c\uc5b4 \uc62c\ub9b4 \uc218 \uc788\u3137."}),"\n",(0,s.jsx)(n.pre,{children:(0,s.jsx)(n.code,{className:"language-java",children:"// Money\nMoney times(int multiplier) {\n  return new Money(amount * multiplier, currency);\n}\n"})}),"\n",(0,s.jsx)(n.p,{children:"\uacf1\ud558\uae30\ub3c4 \uad6c\ud604\ud588\uc73c\ub2c8 \uc774\uc81c \uc544\ubb34\uac83\ub3c4 \uc548 \ud558\ub294 \uba4d\uccad\ud55c \ud558\uc704 \ud074\ub798\uc2a4\ub4e4\uc744 \uc81c\uac70\ud560 \uc218 \uc788\uaca0\ub2e4."})]})}function u(e={}){const{wrapper:n}={...(0,c.a)(),...e.components};return n?(0,s.jsx)(n,{...e,children:(0,s.jsx)(d,{...e})}):d(e)}},1151:(e,n,r)=>{r.d(n,{Z:()=>l,a:()=>i});var s=r(7294);const c={},t=s.createContext(c);function i(e){const n=s.useContext(t);return s.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(c):e.components||c:i(e.components),s.createElement(t.Provider,{value:n},e.children)}}}]);