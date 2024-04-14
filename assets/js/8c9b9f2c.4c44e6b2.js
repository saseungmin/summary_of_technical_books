"use strict";(self.webpackChunksummary_of_technical_books=self.webpackChunksummary_of_technical_books||[]).push([[5021],{1675:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>i,contentTitle:()=>o,default:()=>u,frontMatter:()=>s,metadata:()=>c,toc:()=>d});var r=t(5893),a=t(1151);const s={sidebar_position:15,sidebar_label:"14. \ubc14\uafb8\uae30"},o="\ud83c\udf08 Chapter 14: \ubc14\uafb8\uae30",c={id:"test/test-driven-development/chapter-14",title:"\ud83c\udf08 Chapter 14: \ubc14\uafb8\uae30",description:"2\ud504\ub791\uc774 \uc788\ub294\ub370 \uc774\uac78 \ub2ec\ub7ec\ub85c \ubc14\uafb8\uace0 \uc2f6\ub2e4.",source:"@site/docs/test/test-driven-development/chapter-14.md",sourceDirName:"test/test-driven-development",slug:"/test/test-driven-development/chapter-14",permalink:"/summary_of_technical_books/docs/test/test-driven-development/chapter-14",draft:!1,unlisted:!1,editUrl:"https://github.com/saseungmin/summary_of_technical_books/tree/main/docs/test/test-driven-development/chapter-14.md",tags:[],version:"current",sidebarPosition:15,frontMatter:{sidebar_position:15,sidebar_label:"14. \ubc14\uafb8\uae30"},sidebar:"sidebar",previous:{title:"13. \uc9c4\uc9dc\ub85c \ub9cc\ub4e4\uae30",permalink:"/summary_of_technical_books/docs/test/test-driven-development/chapter-13"},next:{title:"15. \uc11c\ub85c \ub2e4\ub978 \ud1b5\ud654 \ub354\ud558\uae30",permalink:"/summary_of_technical_books/docs/test/test-driven-development/chapter-15"}},i={},d=[];function l(e){const n={code:"code",h1:"h1",p:"p",pre:"pre",...(0,a.a)(),...e.components};return(0,r.jsxs)(r.Fragment,{children:[(0,r.jsx)(n.h1,{id:"-chapter-14-\ubc14\uafb8\uae30",children:"\ud83c\udf08 Chapter 14: \ubc14\uafb8\uae30"}),"\n",(0,r.jsx)(n.p,{children:"2\ud504\ub791\uc774 \uc788\ub294\ub370 \uc774\uac78 \ub2ec\ub7ec\ub85c \ubc14\uafb8\uace0 \uc2f6\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'public void testReduceMoneyDifferentCurrency() {\n  Bank bank = new Bank();\n  bank.addRate("CHF", "USD", 2);\n  Money result = bank.reduce(Money.franc(2), "USD");\n  assertEquals(Money.dollar(1), result);\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"\ub098\ub294 \ud504\ub791\uc744 \ub2ec\ub7ec\ub85c \ubcc0\ud658\ud560 \ub54c \ub098\ub204\uae30 2\ub97c \ud55c\ub2e4. \ub2e4\uc74c \ud55c \uc90c\uc758 \uc9c0\uc800\ubd84\ud55c \ucf54\ub4dc\uba74 \ucd08\ucd09 \ub9c9\ub300\ub97c \ubcfc \uc218 \uc788\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'// Money\npublic Money reduce(String to) {\n  int rate = (currency.equals("CHF") && to.equals("USD")) ? 2 : 1;\n  return new Money(amount / rate, to);\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["\ud690\uc728\uc5d0 \ub300\ud55c \uc77c\uc740 \ubaa8\ub450 ",(0,r.jsx)(n.code,{children:"Bank"}),"\uac00 \ucc98\ub9ac\ud574\uc57c \ud55c\ub2e4. ",(0,r.jsx)(n.code,{children:"Expression.reduce()"}),"\uc758 \uc778\uc790\ub85c ",(0,r.jsx)(n.code,{children:"Bank"}),"\ub97c \ub118\uaca8\uc57c \ud560 \uac83\uc774\ub2e4. \uc6b0\uc120 \ud638\ucd9c\ud558\ub294 \ubd80\ubd84\uc744 \uc791\uc131\ud558\uc790."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Bank\nMoney reduce(Expression source, String to) {\n  return source.reduce(this, to);\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\uadf8\ub9ac\uace0 \uad6c\ud604 \ubd80\ubd84."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'// Expression\nMoney reduce(Bank bank, String to);\n\n// Sum\npublic Money reduce(Bank bank, String to) {\n  int amount = augend.amount + addend.amount;\n  return new Money(amount, to);\n}\n\n// Money\npublic Money reduce(Bank bank, String to) {\n  int rate = (currency.equals("CHF") && to.equals("USD")) ? 2 : 1;\n  return new Money(amount / rate, to);\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["\uc778\ud130\ud398\uc774\uc2a4\uc5d0 \uc120\uc5b8\ub41c \uba54\uc11c\ub4dc\ub294 \uacf5\uc6a9\uc774\uc5b4\uc57c \ud558\ubbc0\ub85c ",(0,r.jsx)(n.code,{children:"Money"}),"\uc758 ",(0,r.jsx)(n.code,{children:"reduce()"}),"\ub3c4 \uacf5\uc6a9\uc774\uc5b4\uc57c \ud55c\ub2e4. \uc774\uc81c \ud690\uc728\uc744 ",(0,r.jsx)(n.code,{children:"Bank"}),"\uc5d0\uc11c \uacc4\uc0b0\ud560 \uc218 \uc788\uac8c \ub410\ub2e4."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'// Bank\nint rate(String from, String to) {\n  return (from.equals("CHF") && to.equals("USD")) ? 2 : 1;\n}\n'})}),"\n",(0,r.jsxs)(n.p,{children:["\uadf8\ub9ac\uace0 \uc62c\ubc14\ub978 \ud658\uc728\uc744 ",(0,r.jsx)(n.code,{children:"bank"}),"\uc5d0\uac8c \ubb3c\uc5b4\ubcf4\uc790."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Money\npublic Money reduce(Bank bank, String to) {\n  int rate = bank.rate(currency, to);\n  return new Money(amount / rate, to);\n}\n"})}),"\n",(0,r.jsxs)(n.p,{children:["\uadc0\ucc2e\uc740 2\uac00 \uc544\uc9c1\ub3c4 \ud14c\uc2a4\ud2b8\uc640 \ucf54\ub4dc \ub450 \ubd80\ubd84\uc5d0 \ubaa8\ub450 \ub098\uc628\ub2e4. \uc774\uac78 \uc5c6\uc560\ubc84\ub9ac\ub824\uba74 ",(0,r.jsx)(n.code,{children:"Bank"}),"\uc5d0\uc11c \ud658\uc728\ud45c\ub97c \uac00\uc9c0\uace0 \uc788\ub2e4\uac00 \ud544\uc694\ud560 \ub54c \ucc3e\uc544\ubcfc \uc218 \uc788\uac8c \ud574\uc57c\ud55c\ub2e4. \ud0a4\ub97c \uc704\ud55c \uac1d\uccb4\ub97c \ub530\ub85c \ub9cc\ub4e4\uc5b4\uc57c\uaca0\ub2e4."]}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Pair\nprivate class Pair {\n  private String from;\n  private String to;\n\n  Pair(String from, String to) {\n    this.from = from;\n    this.to = to;\n  }\n\n  public boolean equals(Object object) {\n    Pair pair = (Pair) object;\n    return from.equals(pair.from) && to.equals(pair.to);\n  }\n\n  public int hashCode() {\n    return 0;\n  }\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"0\uc740 \ucd5c\uc545\uc758 \ud574\uc2dc \ucf54\ub4dc\ub2e4. \ud558\uc9c0\ub9cc \uad6c\ud604\ud558\uae30 \uc27d\uace0 \uc6b0\ub9ac\uac00 \ube68\ub9ac \ub2ec\ub9b4 \uc218 \uc788\ub3c4\ub85d \ub3c4\uc640\uc900\ub2e4\ub294 \uc7a5\uc810\uc774 \uc788\ub2e4. \ud574\uc2dc \ucf54\ub4dc\ub97c \uc774\ub300\ub85c \ub454\ub2e4\uba74 \ud574\uc2dc \ud14c\uc774\ube14\uc5d0\uc11c\uc758 \uac80\uc0c9\uc774 \ub9c8\uce58 \uc120\ud615 \uac80\uc0c9\uacfc \ube44\uc2b7\ud558\uac8c \uc218\ud589\ub420 \uac83\uc774\ub2e4. \ub098\uc911\uc5d0 \ub9ce\uc740 \ud1b5\ud654\ub97c \ub2e4\ub904\uc57c \ud560 \uc77c\uc774 \uc0dd\uae30\uba74 \uadf8\ub54c \uc2e4\uc81c \uce21\uc815 \ub370\uc774\ud130\ub97c \uac00\uc9c0\uace0 \uac1c\uc120\ud558\uac8c \ub420 \uac83\uc774\ub2e4. \uc77c\ub2e8, \ud658\uc728\uc744 \uc800\uc7a5\ud560 \ubb54\uac00\uac00 \ud544\uc694\ud558\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Bank\nprivate Hashtable rates = new Hashtable();\n"})}),"\n",(0,r.jsx)(n.p,{children:"\ud658\uc728\uc744 \uc131\uc815\ud560 \uc218\ub3c4 \uc788\uc5b4\uc57c \ud55c\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Bank\nvoid addRate(String from, String to, int rate) {\n  rates.put(new Pair(from, to), new Integer(rate));\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\uadf8\ub9ac\uace0 \ud544\uc694\ud560 \ub54c \ud658\uc728\uc744 \uc5bb\uc5b4\ub0bc \uc218\ub3c4 \uc788\uc5b4\uc57c \ud55c\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Bank\nint rate(String from, String to) {\n  Integer rate = (Integer) rates.get(new Pair(from, to));\n  return rate.intValue();\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\uc7a0\uae50! \ube68\uac04 \ub9c9\ub300\ub2e4. \ubb34\uc2a8 \uc77c\uc77c\uae4c? \uc5ec\uae30\uc800\uae30 \uc870\uae08 \uae30\uc6c3\uac70\ub824 \ubcf4\uba74, USD\uc5d0\uc11c USD\ub85c\uc758 \ud658\uc728\uc744 \uc694\uccad\ud558\uba74 \uadf8 \uac12\uc774 1\uc774 \ub418\uc5b4\uc57c \ud55c\ub2e4\uace0 \uae30\ub300\ud55c\ub2e4\ub294 \uac83\uc744 \uc54c \uc218 \uc788\ub2e4. \ub73b\ubc16\uc758 \uc77c\uc774\ubbc0\ub85c, \uc880 \uc804\uc5d0 \uc6b0\ub9ac\uac00 \ubc1c\uacac\ud55c \ub0b4\uc6a9\uc744 \ub098\uc911\uc5d0 \ucf54\ub4dc\ub97c \uc77d\uc5b4\ubcfc \ub2e4\ub978 \uc0ac\ub78c\ub4e4\uc5d0\uac8c\ub3c4 \uc54c\ub824 \uc8fc\uae30 \uc704\ud574 \ud14c\uc2a4\ud2b8\ub85c \ub9cc\ub4e4\uc5b4 \ub450\uc790."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:'public void testIdentityRate() {\n  assertEquals(1, new Bank().rate("USD", "USD"));\n}\n'})}),"\n",(0,r.jsx)(n.p,{children:"\uc774\uc81c \uc5d0\ub7ec\uac00 \ucd1d \ub450 \uac1c\ub2e4. \ud558\uc9c0\ub9cc \ud55c \uacf3\ub9cc \ubc14\uafd4 \uc8fc\uba74 \ub450 \uac1c\uac00 \ubaa8\ub450 \uc5c6\uc5b4\uc9c8 \uac83\uc784\uc744 \uc54c \uc218 \uc788\ub2e4."}),"\n",(0,r.jsx)(n.pre,{children:(0,r.jsx)(n.code,{className:"language-java",children:"// Bank\nint rate(String from, String to) {\n  if (from.equals(to)) return 1;\n  Integer rate = (Integer) rates.get(new Pair(from, to));\n  return rate.intValue();\n}\n"})}),"\n",(0,r.jsx)(n.p,{children:"\ucd08\ub85d \ub9c9\ub300!"})]})}function u(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,r.jsx)(n,{...e,children:(0,r.jsx)(l,{...e})}):l(e)}},1151:(e,n,t)=>{t.d(n,{Z:()=>c,a:()=>o});var r=t(7294);const a={},s=r.createContext(a);function o(e){const n=r.useContext(s);return r.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:o(e.components),r.createElement(s.Provider,{value:n},e.children)}}}]);