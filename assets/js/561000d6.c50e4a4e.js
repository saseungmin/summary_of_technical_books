"use strict";(self.webpackChunksummary_of_technical_books=self.webpackChunksummary_of_technical_books||[]).push([[6514],{9183:(e,n,s)=>{s.r(n),s.d(n,{assets:()=>l,contentTitle:()=>i,default:()=>h,frontMatter:()=>r,metadata:()=>c,toc:()=>o});var t=s(5893),a=s(1151);const r={sidebar_position:10},i="\ud83c\udf6d Chapter 9: \ub2e8\uc704 \ud14c\uc2a4\ud2b8",c={id:"clean/clean-code/chapter-9",title:"\ud83c\udf6d Chapter 9: \ub2e8\uc704 \ud14c\uc2a4\ud2b8",description:"\ud83c\udf83 TDD \ubc95\uce59 \uc138 \uac00\uc9c0",source:"@site/docs/clean/clean-code/chapter-9.md",sourceDirName:"clean/clean-code",slug:"/clean/clean-code/chapter-9",permalink:"/summary_of_technical_books/docs/clean/clean-code/chapter-9",draft:!1,unlisted:!1,editUrl:"https://github.com/saseungmin/summary_of_technical_books/tree/main/docs/clean/clean-code/chapter-9.md",tags:[],version:"current",sidebarPosition:10,frontMatter:{sidebar_position:10},sidebar:"sidebar",previous:{title:"\ud83c\udf6d Chapter 8: \uacbd\uacc4",permalink:"/summary_of_technical_books/docs/clean/clean-code/chapter-8"},next:{title:"\ud83c\udf6d Chapter 10: \ud074\ub798\uc2a4",permalink:"/summary_of_technical_books/docs/clean/clean-code/chapter-10"}},l={},o=[{value:"\ud83c\udf83 TDD \ubc95\uce59 \uc138 \uac00\uc9c0",id:"-tdd-\ubc95\uce59-\uc138-\uac00\uc9c0",level:2},{value:"\ud83c\udf83 \uae68\ub057\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc \uc720\uc9c0\ud558\uae30",id:"-\uae68\ub057\ud55c-\ud14c\uc2a4\ud2b8-\ucf54\ub4dc-\uc720\uc9c0\ud558\uae30",level:2},{value:"\ud83c\udf88 \ud14c\uc2a4\ud2b8\ub294 \uc720\uc5f0\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \uc7ac\uc0ac\uc6a9\uc131\uc744 \uc81c\uacf5\ud55c\ub2e4",id:"-\ud14c\uc2a4\ud2b8\ub294-\uc720\uc5f0\uc131-\uc720\uc9c0\ubcf4\uc218\uc131-\uc7ac\uc0ac\uc6a9\uc131\uc744-\uc81c\uacf5\ud55c\ub2e4",level:3},{value:"\ud83c\udf83 \uae68\ub057\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc",id:"-\uae68\ub057\ud55c-\ud14c\uc2a4\ud2b8-\ucf54\ub4dc",level:2},{value:"\ud83c\udf83 \ud14c\uc2a4\ud2b8 \ub2f9 assert \ud558\ub098",id:"-\ud14c\uc2a4\ud2b8-\ub2f9-assert-\ud558\ub098",level:2},{value:"\ud83c\udf88 \ud14c\uc2a4\ud2b8 \ub2f9 \uac1c\ub150 \ud558\ub098",id:"-\ud14c\uc2a4\ud2b8-\ub2f9-\uac1c\ub150-\ud558\ub098",level:3},{value:"\ud83c\udf83 F.I.R.S.T",id:"-first",level:2},{value:"\ud83c\udf83 \uacb0\ub860",id:"-\uacb0\ub860",level:2}];function d(e){const n={code:"code",em:"em",h1:"h1",h2:"h2",h3:"h3",li:"li",p:"p",pre:"pre",strong:"strong",ul:"ul",...(0,a.a)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.h1,{id:"-chapter-9-\ub2e8\uc704-\ud14c\uc2a4\ud2b8",children:"\ud83c\udf6d Chapter 9: \ub2e8\uc704 \ud14c\uc2a4\ud2b8"}),"\n",(0,t.jsx)(n.h2,{id:"-tdd-\ubc95\uce59-\uc138-\uac00\uc9c0",children:"\ud83c\udf83 TDD \ubc95\uce59 \uc138 \uac00\uc9c0"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"\uccab\uc9f8 \ubc95\uce59: \uc2e4\ud328\ud558\ub294 \ub2e8\uc704 \ud14c\uc2a4\ud2b8\ub97c \uc791\uc131\ud560 \ub54c\uae4c\uc9c0 \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc791\uc131\ud558\uc9c0 \uc54a\ub294\ub2e4."}),"\n",(0,t.jsx)(n.li,{children:"\ub458\uc9f8 \ubc95\uce59: \ucef4\ud30c\uc77c\uc740 \uc2e4\ud328\ud558\uc9c0 \uc54a\uc73c\uba74\uc11c \uc2e4\ud589\uc774 \uc2e4\ud328\ud558\ub294 \uc815\ub3c4\ub85c\ub9cc \ub2e8\uc704 \ud14c\uc2a4\ud2b8\ub97c \uc791\uc131\ud55c\ub2e4."}),"\n",(0,t.jsx)(n.li,{children:"\uc14b\uc9f8 \ubc95\uce59: \ud604\uc7ac \uc2e4\ud328\ud558\ub294 \ud14c\uc2a4\ud2b8\ub97c \ud1b5\uacfc\ud560 \uc815\ub3c4\ub85c\ub9cc \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc791\uc131\ud55c\ub2e4."}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"\uc704 \uc138 \uac00\uc9c0 \uaddc\uce59\uc744 \ub530\ub974\uba74 \uac1c\ubc1c\uacfc \ud14c\uc2a4\ud2b8\uac00 \ub300\ub7b5 30\ucd08 \uc8fc\uae30\ub85c \ubb36\uc778\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uc640 \uc2e4\uc81c \ucf54\ub4dc\uac00 \ud568\uaed8\ub098\uc62c\ubfd0\ub354\ub7ec \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \uc2e4\uc81c \ucf54\ub4dc\ubcf4\ub2e4 \ubd88\uacfc \uba87 \ucd08 \uc804\uc5d0 \ub098\uc628\ub2e4."}),"\n",(0,t.jsx)(n.p,{children:"\uc774\ub807\uac8c \uc77c\ud558\uba74 \ub9e4\uc77c \uc218\uc2ed \uac1c, \ub9e4\ub2ec \uc218\ubc31 \uac1c, \ub9e4\ub144 \uc218\ucc9c \uac1c\uc5d0 \ub2ec\ud558\ub294 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \ub098\uc628\ub2e4. \uc774\ub807\uac8c \uc77c\ud558\uba74 \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc0ac\uc2e4\uc0c1 \uc804\ubd80 \ud14c\uc2a4\ud2b8\ud558\ub294 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \ub098\uc628\ub2e4. \ud558\uc9c0\ub9cc \uc2e4\uc81c \ucf54\ub4dc\uc640 \ub9de\uba39\uc744 \uc815\ub3c4\ub85c \ubc29\ub300\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc2ec\uac01\ud55c \uad00\ub9ac \ubb38\uc81c\ub97c \uc720\ubc1c\ud558\uae30\ub3c4 \ud55c\ub2e4."}),"\n",(0,t.jsx)(n.h2,{id:"-\uae68\ub057\ud55c-\ud14c\uc2a4\ud2b8-\ucf54\ub4dc-\uc720\uc9c0\ud558\uae30",children:"\ud83c\udf83 \uae68\ub057\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc \uc720\uc9c0\ud558\uae30"}),"\n",(0,t.jsx)(n.p,{children:"\ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \uc9c0\uc800\ubd84\ud560\uc218\ub85d \ubcc0\uacbd\ud558\uae30 \uc5b4\ub824\uc6cc\uc9c4\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \ubcf5\uc7a1\ud560\uc218\ub85d \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc9dc\ub294 \uc2dc\uac04\ubcf4\ub2e4 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\ub97c \ucd94\uac00\ud558\ub294 \uc2dc\uac04\uc774 \ub354 \uac78\ub9ac\uae30 \uc2ed\uc0c1\uc774\ub2e4. \uc2e4\uc81c \ucf54\ub4dc\ub97c \ubcc0\uacbd\ud574 \uae30\uc874 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc2e4\ud328\ud558\uae30 \uc2dc\uc791\ud558\uba74, \uc9c0\uc800\ubd84\ud55c \ucf54\ub4dc\ub85c \uc778\ud574, \uc2e4\ud328\ud558\ub294 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\ub97c \uc810\uc810 \ub354 \ud1b5\uacfc\uc2dc\ud0a4\uae30 \uc5b4\ub824\uc6cc\uc9c4\ub2e4. \uadf8\ub798\uc11c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uacc4\uc18d\ud574\uc11c \ub298\uc5b4\ub098\ub294 \ubd80\ub2f4\uc774 \ub418\ubc84\ub9b0\ub2e4."}),"\n",(0,t.jsx)(n.p,{children:"\ud14c\uc2a4\ud2b8 \uc288\ud2b8\uac00 \uc5c6\uc73c\uba74 \uac1c\ubc1c\uc790\ub294 \uc790\uc2e0\uc774 \uc218\uc815\ud55c \ucf54\ub4dc\uac00 \uc81c\ub300\ub85c \ub3c4\ub294\uc9c0 \ud655\uc778\ud560 \ubc29\ubc95\uc774 \uc5c6\ub2e4. \ud14c\uc2a4\ud2b8 \uc288\ud2b8\uac00 \uc5c6\uc73c\uba74 \uc2dc\uc2a4\ud15c \uc774\ucabd\uc744 \uc218\uc815\ud574\ub3c4 \uc800\ucabd\uc774 \uc548\uc804\ud558\ub2e4\ub294 \uc0ac\uc2e4\uc744 \uac80\uc99d\ud558\uc9c0 \ubabb\ud55c\ub2e4. \uadf8\ub798\uc11c \uacb0\ud568\uc728\uc774 \ub192\uc544\uc9c0\uc9c0 \uc2dc\uc791\ud55c\ub2e4. \uc758\ub3c4\ud558\uc9c0 \uc54a\uc740 \uacb0\ud568 \uc218\uac00 \ub9ce\uc544\uc9c0\uba74 \uac1c\ubc1c\uc790\ub294 \ubcc0\uacbd\uc744 \uc8fc\uc800\ud55c\ub2e4. \ubcc0\uacbd\ud558\uba74 \ub4dd\ubcf4\ub2e4 \ud574\uac00 \ud06c\ub2e4 \uc0dd\uac01\ud574 \ub354 \uc774\uc0c1 \ucf54\ub4dc\ub97c \uc815\ub9ac\ud558\uc9c0 \uc54a\ub294\ub2e4. \uadf8\ub7ec\uba74\uc11c \ucf54\ub4dc\uac00 \ub9dd\uac00\uc9c0\uae30 \uc2dc\uc791\ud55c\ub2e4. \uacb0\uad6d \ud14c\uc2a4\ud2b8 \uc288\ud2b8\ub3c4 \uc5c6\uace0, \uc5bc\uae30\uc124\uae30 \ub4a4\uc11e\uc778 \ucf54\ub4dc\uc5d0, \uc88c\uc808\ud55c \uace0\uac1d\uacfc, \ud14c\uc2a4\ud2b8\uc5d0 \uc3df\uc544 \ubd80\uc740 \ub178\ub825\uc774 \ud5c8\uc0ac\uc600\ub2e4\ub294 \uc2e4\ub9dd\uac10\ub9cc \ub0a8\uae34\ub2e4."}),"\n",(0,t.jsxs)(n.p,{children:["\ub0b4\uac00 \uc774\uc57c\uae30\uac00 \uc804\ud558\ub294 \uad50\ud6c8\uc740 \ub2e4\uc74c\uacfc \uac19\ub2e4. ",(0,t.jsx)(n.strong,{children:"\ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc2e4\uc81c \ucf54\ub4dc \ubabb\uc9c0 \uc54a\uac8c \uc911\uc694\ud558\ub2e4."})," \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc774\ub958 \uc2dc\ubbfc\uc774 \uc544\ub2c8\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc0ac\uace0\uc640 \uc124\uacc4\uc640 \uc8fc\uc758\uac00 \ud544\uc694\ud558\ub2e4. \uc2e4\uc81c \ucf54\ub4dc \ubabb\uc9c0 \uc54a\uac8c \uae68\ub057\ud558\uac8c \uc9dc\uc57c \ud55c\ub2e4."]}),"\n",(0,t.jsx)(n.h3,{id:"-\ud14c\uc2a4\ud2b8\ub294-\uc720\uc5f0\uc131-\uc720\uc9c0\ubcf4\uc218\uc131-\uc7ac\uc0ac\uc6a9\uc131\uc744-\uc81c\uacf5\ud55c\ub2e4",children:"\ud83c\udf88 \ud14c\uc2a4\ud2b8\ub294 \uc720\uc5f0\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \uc7ac\uc0ac\uc6a9\uc131\uc744 \uc81c\uacf5\ud55c\ub2e4"}),"\n",(0,t.jsxs)(n.p,{children:["\ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uae68\ub057\ud558\uac8c \uc720\uc9c0\ud558\uc9c0 \uc54a\uc73c\uba74 \uacb0\uad6d \uc783\uc5b4\ubc84\ub9b0\ub2e4. \uadf8\ub9ac\uace0 \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc5c6\uc73c\uba74 \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc720\uc5f0\ud558\uac8c \ub9cc\ub4dc\ub294 \ubc84\ud300\ubaa9\ub3c4 \uc0ac\ub77c\uc9c4\ub2e4. \ub9de\ub2e4, \uc81c\ub300\ub85c \uc77d\uc5c8\ub2e4. \ucf54\ub4dc\uc5d0 \uc720\uc5f0\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \uc7ac\uc0ac\uc6a9\uc131\uc744 \uc81c\uacf5\ud558\ub294 \ubc84\ud300\ubaa9\uc774 \ubc14\ub85c ",(0,t.jsx)(n.strong,{children:"\ub2e8\uc704 \ud14c\uc2a4\ud2b8"}),"\ub2e4. \uc774\uc720\ub294 \ub2e8\uc21c\ud558\ub2e4. \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc788\uc73c\uba74 \ubcc0\uacbd\uc774 \ub450\ub835\uc9c0 \uc54a\uc73c\ub2c8\uae4c! \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc5c6\ub2e4\uba74 \ubaa8\ub4e0 \ubcc0\uacbd\uc774 \uc7a0\uc815\uc801\uc778 \ubc84\uadf8\ub2e4. \uc544\ud0a4\ud14d\uccd0\uac00 \uc544\ubb34\ub9ac \uc720\uc5f0\ud558\ub354\ub77c\ub3c4, \uc124\uacc4\ub97c \uc544\ubb34\ub9ac \uc798 \ub098\ub234\ub354\ub77c\ub3c4, \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc5c6\uc73c\uba74 \uac1c\ubc1c\uc790\ub294 \ubcc0\uacbd\uc744 \uc8fc\uc800\ud55c\ub2e4. \ubc84\uadf8\uac00 \uc228\uc5b4\ub4e4\uae4c \ub450\ub835\uae30 \ub54c\ubb38\uc774\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:["\ud558\uc9c0\ub9cc \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 ",(0,t.jsx)(n.strong,{children:"\uc788\ub2e4\uba74"})," \uacf5\ud3ec\ub294 \uc0ac\uc2e4\uc0c1 \uc0ac\ub77c\uc9c4\ub2e4. \ud14c\uc2a4\ud2b8 \ucee4\ubc84\ub9ac\uc9c0\uac00 \ub192\uc744\uc218\ub85d \uacf5\ud3ec\ub294 \uc904\uc5b4\ub4e0\ub2e4. \uc544\ud0a4\ud14d\ucc98\uac00 \ubd80\uc2e4\ud55c \ucf54\ub4dc\ub098 \uc124\uacc4\uac00 \ubaa8\ud638\ud558\uace0 \uc5c9\ub9dd\uc778 \ucf54\ub4dc\ub77c\ub3c4 \ubcc4\ub2e4\ub978 \uc6b0\ub824 \uc5c6\uc774 \ubcc0\uacbd\ud560 \uc218 \uc788\ub2e4. \uc544\ub2c8, \uc624\ud788\ub824 \uc548\uc2ec\ud558\uace0 \uc544\ud0a4\ud14d\ucc98\uc640 \uc124\uacc4\ub97c \uac1c\uc120\ud560 \uc218 \uc788\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:["\uadf8\ub7ec\ubbc0\ub85c \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc810\uac80\ud558\ub294 \uc790\ub3d9\ud654\ub41c \ub2e8\uc704 \ud14c\uc2a4\ud2b8 \uc288\ud2b8\ub294 \uc124\uacc4\uc640 \uc544\ud0a4\ud14d\ucc98\ub97c \ucd5c\ub300\ud55c \uae68\ub057\ud558\uac8c \ubcf4\uc874\ud558\ub294 \uc5f4\uc1e0\ub2e4. \ud14c\uc2a4\ud2b8\ub294 \uc720\uc5f0\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \uc7ac\uc0ac\uc6a9\uc131\uc744 \uc81c\uacf5\ud55c\ub2e4. \ud14c\uc2a4\ud2b8 \ucf00\uc774\uc2a4\uac00 \uc788\uc73c\uba74 ",(0,t.jsx)(n.strong,{children:"\ubcc0\uacbd"}),"\uc774 \uc26c\uc6cc\uc9c0\uae30 \ub54c\ubb38\uc774\ub2e4."]}),"\n",(0,t.jsx)(n.p,{children:"\ub530\ub77c\uc11c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \uc9c0\uc800\ubd84\ud558\uba74 \ucf54\ub4dc\ub97c \ubcc0\uacbd\ud558\ub294 \ub2a5\ub825\uc774 \ub5a8\uc5b4\uc9c0\uba74 \ucf54\ub4dc \uad6c\uc870\ub97c \uac1c\uc120\ud558\ub294 \ub2a5\ub825\ub3c4 \ub5a8\uc5b4\uc9c4\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \uc9c0\uc800\ubd84\ud560\uc218\ub85d \uc2e4\uc81c \ucf54\ub4dc\ub3c4 \uc9c0\uc800\ubd84\ud574\uc9c4\ub2e4. \uacb0\uad6d \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uc783\uc5b4\ubc84\ub9ac\uace0 \uc2e4\uc81c \ucf54\ub4dc\ub3c4 \ub9dd\uac00\uc9c4\ub2e4."}),"\n",(0,t.jsx)(n.h2,{id:"-\uae68\ub057\ud55c-\ud14c\uc2a4\ud2b8-\ucf54\ub4dc",children:"\ud83c\udf83 \uae68\ub057\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc"}),"\n",(0,t.jsx)(n.p,{children:"\uae68\ub057\ud55c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \ub9cc\ub4e4\ub824\uba3c? \uc138 \uac00\uc9c0\uac00 \ud544\uc694\ud558\ub2e4. \uac00\ub3c5\uc131, \uac00\ub3c5\uc131, \uac00\ub3c5\uc131. \uc5b4\uca4c\uba74 \uac00\ub3c5\uc131\uc740 \uc2e4\uc81c \ucf54\ub4dc\ubcf4\ub2e4 \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uc5d0 \ub354\ub354\uc6b1 \uc911\uc694\ud558\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uc5d0\uc11c \uac00\ub3c5\uc131\uc744 \ub192\uc774\ub824\uba74? \uc5ec\ub290 \ucf54\ub4dc\uc640 \ub9c8\ucc2c\uac00\uc9c0\ub2e4. \uba85\ub8cc\uc131, \ub2e8\uc21c\uc131, \ud48d\ubd80\ud55c \ud45c\ud604\ub825\uc774 \ud544\uc694\ud558\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \ucd5c\uc18c\uc758 \ud45c\ud604\uc73c\ub85c \ub9ce\uc740 \uac83\uc744 \ub098\ud0c0\ub0b4\uc57c \ud55c\ub2e4."}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:'public void testGetPageHierarchyAsXml() throws Exception {\n  makePages("PageOne", "PageOne.ChildOne", "PageTwo");\n\n  submitRequest("root", "type:pages");\n\n  assertResponseIsXML();\n  assertResponseContains(\n    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"\n  );\n}\n\npublic void testSymbolicLinksAreNotInXmlPageHierarchy() throws Exception {\n  WikiPage page = makePage("PageOne");\n  makePages("PageOne.ChildOne", "PageTwo");\n\n  addLinkTo(page, "PageTwo", "SymPage");\n\n  submitRequest("root", "type:pages");\n\n  assertResponseIsXML();\n  assertResponseContains(\n    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"\n  );\n  assertResponseDoesNotContain("SymPage");\n}\n\npublic void testGetDataAsXml() throws Exception {\n  makePageWithContent("TestPageOne", "test page");\n  submitRequest("TestPageOne", "type:data");\n\n  assertResponseIsXML();\n  assertResponseContains("test page", "<Test");\n}\n'})}),"\n",(0,t.jsx)(n.p,{children:"\uac01 \ud14c\uc2a4\ud2b8\ub294 \uba85\ud655\ud788 \uc138 \ubd80\ubd84\uc73c\ub85c \ub098\ub220\uc9c4\ub2e4. \uccab \ubd80\ubd84\uc740 \ud14c\uc2a4\ud2b8 \uc790\ub8cc\ub97c \ub9cc\ub4e0\ub2e4. \ub450 \ubc88\uc9f8 \ubd80\ubd84\uc740 \ud14c\uc2a4\ud2b8 \uc790\ub8cc\ub97c \uc870\uc791\ud558\uba70, \uc138 \ubc88\uc9f8 \ubd80\ubd84\uc740 \uc870\uc791\ud55c \uacb0\uacfc\uac00 \uc62c\ubc14\ub978\uc9c0 \ud655\uc778\ud55c\ub2e4."}),"\n",(0,t.jsx)(n.p,{children:"\uc7a1\ub2e4\ud558\uace0 \uc138\uc138\ud55c \ucf54\ub4dc\ub97c \uac70\uc758 \ub2e4 \uc5c6\uc574\ub2e4\ub294 \uc0ac\uc2e4\uc5d0 \uc8fc\ubaa9\ud55c\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \ubcf8\ub860\uc5d0 \ub3cc\uc785\ud574 \uc9c4\uc9dc \ud544\uc694\ud55c \uc790\ub8cc \uc720\ud615\uacfc \ud568\uc218\ub9cc \uc0ac\uc6a9\ud55c\ub2e4. \uadf8\ub7ec\ubbc0\ub85c \ucf54\ub4dc\ub97c \uc77d\ub294 \uc0ac\ub78c\uc740 \uc628\uac16 \uc7a1\ub2e4\ud558\uace0 \uc138\uc138\ud55c \ucf54\ub4dc\uc5d0 \uc8fc\ub205\ub4e4\uace0 \ud5f7\uac08\ub9b4 \ud544\uc694 \uc5c6\uc774 \ucf54\ub4dc\uac00 \uc218\ud589\ud558\ub294 \uae30\ub2a5\uc744 \uc7ac\ube68\ub9ac \uc774\ud574\ud55c\ub2e4."}),"\n",(0,t.jsx)(n.h2,{id:"-\ud14c\uc2a4\ud2b8-\ub2f9-assert-\ud558\ub098",children:"\ud83c\udf83 \ud14c\uc2a4\ud2b8 \ub2f9 assert \ud558\ub098"}),"\n",(0,t.jsxs)(n.p,{children:["JUnit\uc73c\ub85c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uc9e4 \ub54c\ub294 \ud568\uc218\ub9c8\ub2e4 ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc744 \ub2e8 \ud558\ub098\ub9cc \uc0ac\uc6a9\ud574\uc57c \ud55c\ub2e4\uace0 \uc8fc\uc7a5\ud558\ub294 \ud559\ud30c\uac00 \uc788\ub2e4. \uac00\ud639\ud55c \uaddc\uce59\uc774\ub77c \uc5ec\uae38\uc9c0\ub3c4 \ubaa8\ub974\uc9c0\ub9cc, \ud655\uc2e4\ud788 \uc7a5\uc810\uc774 \uc788\ub2e4. ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc774 \ub2e8 \ud558\ub098\uc778 \ud568\uc218\ub294 \uacb0\ub860\uc774 \ud558\ub098\ub77c\uc11c \ucf54\ub4dc\ub97c \uc774\ud574\ud558\uae30 \uc27d\uace0 \ube60\ub974\ub2e4."]}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-java",children:'public void testGetPageHierarchyAsXml() throws Exception {\n  givenPage("PageOne", "PageOne.ChildOne", "PageTwo");\n\n  whenRequestIsIssued("root", "type:pages");\n\n  thenResponseShouldBeXML();\n}\n\npublic void testGetPageHierarchyHasRightTags() throws Exception {\n  givenPage("PageOne", "PageOne.ChildOne", "PageTwo");\n\n  whenRequestIsIssued("root", "type:pages");\n\n  thenResponseShouldContain(\n    "<name>PageOne</name>", "<name>PageTwo</name>", "<name>ChildOne</name>"\n  );\n}\n'})}),"\n",(0,t.jsxs)(n.p,{children:["\uc704\uc5d0\uc11c \ud568\uc218 \uc774\ub984\uc744 \ubc14\uafd4 ",(0,t.jsx)(n.code,{children:"given-when-then"}),"\uc774\ub77c\ub294 \uad00\ub840\ub97c \uc0ac\uc6a9\ud588\ub2e4\ub294 \uc0ac\uc2e4\uc5d0 \uc8fc\ubaa9\ud55c\ub2e4. \uadf8\ub7ec\uba74 \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uc77d\uae30\uac00 \uc26c\uc6cc\uc9c4\ub2e4. \ubd88\ud589\ud558\uac8c\ub3c4, \uc704\uc5d0\uc11c \ubcf4\ub4ef\uc774, \ud14c\uc2a4\ud2b8\ub97c \ubd84\ub9ac\ud558\uba74 \uc911\ubcf5\ub418\ub294 \ucf54\ub4dc\uac00 \ub9ce\uc544\uc9c4\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:["TEMPLATE METHOD \ud328\ud134\uc744 \uc0ac\uc6a9\ud558\uba74 \uc911\ubcf5\uc744 \uc81c\uac70\ud560 \uc218 \uc788\ub2e4. ",(0,t.jsx)(n.code,{children:"given/when"})," \ubd80\ubd84\uc744 \ubd80\ubaa8 \ud074\ub798\uc2a4\uc5d0 \ub450\uace0 ",(0,t.jsx)(n.code,{children:"then"})," \ubd80\ubd84\uc744 \uc790\uc2dd \ud074\ub798\uc2a4\uc5d0 \ub450\uba74 \ub41c\ub2e4. \uc544\ub2c8\uba74 \uc644\uc804\ud788 \ub3c5\uc790\uc801\uc778 \ud14c\uc2a4\ud2b8 \ud074\ub798\uc2a4\ub97c \ub9cc\ub4e4\uc5b4 ",(0,t.jsx)(n.code,{children:"@Before"})," \ud568\uc218\uc5d0 ",(0,t.jsx)(n.code,{children:"given/when"})," \ubd80\ubd84\uc744 \ub123\uace0 ",(0,t.jsx)(n.code,{children:"@Test"})," \ud568\uc218\uc5d0 ",(0,t.jsx)(n.code,{children:"then"})," \ubd80\ubd84\uc744 \ub123\uc5b4\ub3c4 \ub41c\ub2e4. \ud558\uc9c0\ub9cc \ubaa8\ub450\uac00 \ubc30\ubcf4\ub2e4 \ubc30\uaf3d\uc774 \ub354 \ud06c\ub2e4. \uc774\uac83\uc800\uac83 \uac10\uc548\ud574 \uacb0\uad6d ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc744 \uc5ec\ub7ff \uc0ac\uc6a9\ud558\ub294 \ud3b8\uc774 \uc88b\ub2e4\uace0 \uc0dd\uac01\ud55c\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:["\ub098\ub294 \ub2e8\uc77c ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc774\ub77c\ub294 \uaddc\uce59\uc774 \ud6cc\ub96d\ud55c \uc9c0\uce68\uc774\ub77c \uc0dd\uac01\ud55c\ub2e4. \ub300\uccb4\ub85c \ub098\ub294 \ub2e8\uc77c ",(0,t.jsx)(n.code,{children:"assert"}),"\ub97c \uc9c0\uc6d0\ud558\ub294 \ud574\ub2f9 \ubd84\uc57c \ud14c\uc2a4\ud2b8 \uc5b8\uc5b4\ub97c \ub9cc\ub4e4\ub824 \ub178\ub825\ud55c\ub2e4. \ud558\uc9c0\ub9cc \ub54c\ub85c\ub294 \uc8fc\uc800 \uc5c6\uc774 \ud568\uc218 \ud558\ub098\uc5d0 \uc5ec\ub7ec ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc744 \ub123\uae30\ub3c4 \ud55c\ub2e4. \ub2e8\uc9c0 ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38 \uac1c\uc218\ub294 \ucd5c\ub300\ud55c \uc904\uc5ec\uc57c \uc88b\ub2e4\ub294 \uc0dd\uac01\uc774\ub2e4."]}),"\n",(0,t.jsx)(n.h3,{id:"-\ud14c\uc2a4\ud2b8-\ub2f9-\uac1c\ub150-\ud558\ub098",children:"\ud83c\udf88 \ud14c\uc2a4\ud2b8 \ub2f9 \uac1c\ub150 \ud558\ub098"}),"\n",(0,t.jsxs)(n.p,{children:["\uc774\uac83\uc800\uac83 \uc7a1\ub2e4\ud55c \uac1c\ub150\uc744 \uc5f0\uc18d\uc73c\ub85c \ud14c\uc2a4\ud2b8\ud558\ub294 \uae34 \ud568\uc218\ub294 \ud53c\ud55c\ub2e4. \uac01 \uc808\uc5d0 ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38\uc774 \uc5ec\ub7ff\uc774\ub77c\ub294 \uc0ac\uc2e4\uc774 \ubb38\uc81c\uac00 \uc544\ub2c8\ub2e4. \ud55c \ud14c\uc2a4\ud2b8 \ud568\uc218\uc5d0\uc11c \uc5ec\ub7ec \uac1c\ub150\uc744 \ud14c\uc2a4\ud2b8\ud55c\ub2e4\ub294 \uc0ac\uc2e4\uc774 \ubb38\uc81c\ub2e4. \uadf8\ub7ec\ubbc0\ub85c \uac00\uc7a5 \uc88b\uc740 \uaddc\uce59\uc740 ",(0,t.jsxs)(n.em,{children:["\uac1c\ub150 \ub2f9 ",(0,t.jsx)(n.code,{children:"assert"})," \ubb38 \uc218\ub97c \ucd5c\uc18c\ub85c \uc904\uc5ec\ub77c"]}),"\uc640 ",(0,t.jsx)(n.em,{children:"\ud14c\uc2a4\ud2b8 \ud568\uc218 \ud558\ub098\ub294 \uac1c\ub150 \ud558\ub098\ub9cc \ud14c\uc2a4\ud2b8\ud558\ub77c"}),"\ub77c \ud558\uaca0\ub2e4."]}),"\n",(0,t.jsx)(n.h2,{id:"-first",children:"\ud83c\udf83 F.I.R.S.T"}),"\n",(0,t.jsx)(n.p,{children:"\uae68\ub057\ud55c \ud14c\uc2a4\ud2b8\ub294 \ub2e4\uc74c \ub2e4\uc12f \uac00\uc9c0 \uaddc\uce59\uc744 \ub530\ub974\ub294\ub370, \uac01 \uaddc\uce59\uc5d0\uc11c \uccab \uae00\uc790\ub97c \ub530\uc624\uba74 FIRST\uac00 \ub41c\ub2e4."}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\ube60\ub974\uac8c"}),": \ud14c\uc2a4\ud2b8\ub294 \ube68\ub77c\uc57c \ud55c\ub2e4. \ud14c\uc2a4\ud2b8\ub294 \ube68\ub9ac \ub3cc\uc544\uc57c \ud55c\ub2e4\ub294 \ub9d0\uc774\ub2e4. \ud14c\uc2a4\ud2b8\uac00 \ub290\ub9ac\uba74 \uc790\uc8fc \ub3cc\ub9b4 \uc5c4\ub450\ub97c \ubabb \ub0b8\ub2e4. \uc790\uc8fc \ub3cc\ub9ac\uc9c0 \uc54a\uc73c\uba74 \ucd08\ubc18\uc5d0 \ubb38\uc81c\ub97c \ucc3e\uc544\ub0b4 \uace0\uce58\uc9c0 \ubabb\ud55c\ub2e4. \ucf54\ub4dc\ub97c \ub9c8\uc74c\uaecf \uc815\ub9ac\ud558\uc9c0\ub3c4 \ubabb\ud55c\ub2e4. \uacb0\uad6d \ucf54\ub4dc \ud488\uc9c8\uc774 \ub9dd\uac00\uc9c0\uae30 \uc2dc\uc791\ud55c\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\ub3c5\ub9bd\uc801\uc73c\ub85c"}),": \uac01 \ud14c\uc2a4\ud2b8\ub294 \uc11c\ub85c \uc758\uc874\ud558\uba74 \uc548 \ub41c\ub2e4. \ud55c \ud14c\uc2a4\ud2b8\uac00 \ub2e4\uc74c \ud14c\uc2a4\ud2b8\uac00 \uc2e4\ud589\ub420 \ud658\uacbd\uc744 \uc900\ube44\ud574\uc11c\ub294 \uc548 \ub41c\ub2e4. \uac01 \ud14c\uc2a4\ud2b8\ub294 \ub3c5\ub9bd\uc801\uc73c\ub85c \uadf8\ub9ac\uace0 \uc5b4\ub5a4 \uc21c\uc11c\ub85c \uc2e4\ud589\ud574\ub3c4 \uad1c\ucc2e\uc544\uc57c \ud55c\ub2e4. \ud14c\uc2a4\ud2b8\uac00 \uc11c\ub85c\uc5d0\uac8c \uc758\uc874\ud558\uba74 \ud558\ub098\uac00 \uc2e4\ud328\ud560 \ub54c \ub098\uba38\uc9c0\ub3c4 \uc787\ub2ec\uc544 \uc2e4\ud328\ud558\ubbc0\ub85c \uc6d0\uc778\uc744 \uc9c4\ub2e8\ud558\uae30 \uc5b4\ub824\uc6cc\uc9c0\uba70 \ud6c4\ubc18 \ud14c\uc2a4\ud2b8\uac00 \ucc3e\uc544\ub0b4\uc57c \ud560 \uacb0\ud568\uc774 \uc228\uaca8\uc9c4\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\ubc18\ubcf5\uac00\ub2a5\ud558\uac8c"}),": \ud14c\uc2a4\ud2b8\ub294 \uc5b4\ub5a4 \ud658\uacbd\uc5d0\uc11c\ub3c4 \ubc18\ubcf5 \uac00\ub2a5\ud574\uc57c \ud55c\ub2e4. \uc2e4\uc81c \ud658\uacbd, QA \ud658\uacbd, \ubc84\uc2a4\ub97c \ud0c0\uace0 \uc9d1\uc73c\ub85c \uac00\ub294 \uae38\uc5d0 \uc0ac\uc6a9\ud558\ub294 \ub178\ud2b8\ubd81 \ud658\uacbd\uc5d0\uc11c\ub3c4 \uc2e4\ud589\ud560 \uc218 \uc788\uc5b4\uc57c \ud55c\ub2e4. \ud14c\uc2a4\ud2b8\uac00 \ub3cc\uc544\uac00\uc9c0 \uc54a\ub294 \ud658\uacbd\uc774 \ud558\ub098\ub77c\ub3c4 \uc788\ub2e4\uba74 \ud14c\uc2a4\ud2b8\uac00 \uc2e4\ud328\ud55c \uc774\uc720\ub97c \ub458\ub7ec\ub308 \ubcc0\uba85\uc774 \uc0dd\uae34\ub2e4. \uacc4\ub2e4\uac00 \ud658\uacbd\uc774 \uc9c0\uc6d0\ub418\uc9c0 \uc54a\uae30\uc5d0 \ud14c\uc2a4\ud2b8\ub97c \uc218\ud589\ud558\uc9c0 \ubabb\ud558\ub294 \uc0c1\ud669\uc5d0 \uc9c1\uba74\ud55c\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\uc790\uac00\uac80\uc9d5\ud558\ub294"}),": \ud14c\uc2a4\ud2b8\ub294 \ubd80\uc6b8(bool) \uac12\uc73c\ub85c \uacb0\uacfc\ub97c \ub0b4\uc57c \ud55c\ub2e4. \uc131\uacf5 \uc544\ub2c8\uba74 \uc2e4\ud328\ub2e4. \ud1b5\uacfc \uc5ec\ubd80\ub97c \uc54c\ub824\uace0 \ub85c\uadf8 \ud30c\uc77c\uc744 \uc77d\uac8c \ub9cc\ub4e4\uc5b4\uc11c\ub294 \uc548 \ub41c\ub2e4. \ud1b5\uacfc \uc5ec\ubd80\ub97c \ubcf4\ub824\uace0 \ud14d\uc2a4\ud2b8 \ud30c\uc77c \ub450 \uac1c\ub97c \uc218\uc791\uc5c5\uc73c\ub85c \ube44\uad50\ud558\uac8c \ub9cc\ub4e4\uc5b4\uc11c\ub3c4 \uc548 \ub41c\ub2e4. \ud14c\uc2a4\ud2b8\uac00 \uc2a4\uc2a4\ub85c \uc131\uacf5\uacfc \uc2e4\ud328\ub97c \uac00\ub2a0\ud558\uc9c0 \uc54a\ub294\ub2e4\uba74 \ud310\ub2e8\uc740 \uc8fc\uad00\uc801\uc774 \ub418\uba70 \uc9c0\ub8e8\ud55c \uc218\uc791\uc5c5 \ud3c9\uac00\uac00 \ud544\uc694\ud558\uac8c \ub41c\ub2e4."]}),"\n",(0,t.jsxs)(n.p,{children:[(0,t.jsx)(n.strong,{children:"\uc801\uc2dc\uc5d0"}),": \ud14c\uc2a4\ud2b8\ub294 \uc801\uc2dc\uc5d0 \uc791\uc131\ud574\uc57c \ud55c\ub2e4. \ub2e8\uc704 \ud14c\uc2a4\ud2b8\ub294 \ud14c\uc2a4\ud2b8\ud558\ub824\ub294 \uc2e4\uc81c \ucf54\ub4dc\ub97c \uad6c\ud604\ud558\uae30 \uc9c1\uc804\uc5d0 \uad6c\ud604\ud55c\ub2e4. \uc2e4\uc81c \ucf54\ub4dc\ub97c \uad6c\ud604\ud55c \ub2e4\uc74c\uc5d0 \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \ub9cc\ub4e4\uba74 \uc2e4\uc81c \ucf54\ub4dc\uac00 \ud14c\uc2a4\ud2b8\ud558\uae30 \uc5b4\ub835\ub2e4\ub294 \uc0ac\uc2e4\uc744 \ubc1c\uacac\ud560\uc9c0\ub3c4 \ubaa8\ub978\ub2e4. \uc5b4\ub5a4 \uc2e4\uc81c \ucf54\ub4dc\ub294 \ud14c\uc2a4\ud2b8\ud558\uae30 \ub108\ubb34 \uc5b4\ub835\ub2e4\uace0 \ud310\uba85\ub0a0\uc9c0 \ubaa8\ub978\ub2e4. \ud14c\uc2a4\ud2b8\uac00 \ubd88\uac00\ub2a5\ud558\ub3c4\ub85d \uc2e4\uc81c \ucf54\ub4dc\ub97c \uc124\uacc4\ud560\uc9c0\ub3c4 \ubaa8\ub978\ub2e4."]}),"\n",(0,t.jsx)(n.h2,{id:"-\uacb0\ub860",children:"\ud83c\udf83 \uacb0\ub860"}),"\n",(0,t.jsx)(n.p,{children:"\ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc2e4\uc81c \ucf54\ub4dc\ub9cc\ud07c\uc774\ub098 \ud504\ub85c\uc81d\ud2b8 \uac74\uac15\uc5d0 \uc911\uc694\ud558\ub2e4. \uc5b4\uca4c\uba74 \uc2e4\uc81c \ucf54\ub4dc\ubcf4\ub2e4 \ub354 \uc911\uc694\ud560\uc9c0\ub3c4 \ubaa8\ub974\uaca0\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc2e4\uc81c \ucf54\ub4dc\uc758 \uc720\uc5f0\uc131, \uc720\uc9c0\ubcf4\uc218\uc131, \uc7ac\uc0ac\uc6a9\uc131\uc744 \ubcf4\uc874\ud558\uace0 \uac15\ud654\ud558\uae30 \ub54c\ubb38\uc774\ub2e4. \uadf8\ub7ec\ubbc0\ub85c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub294 \uc9c0\uc18d\uc801\uc73c\ub85c \uaea0\ub057\ud558\uac8c \uad00\ub9ac\ud558\uc790. \ud45c\ud604\ub825\uc744 \ub192\uc774\uace0 \uac04\uacb0\ud558\uac8c \uc815\ub9ac\ud558\uc790. \ud14c\uc2a4\ud2b8 API\ub97c \uad6c\ud604\ud574 \ub3c4\uba54\uc778 \ud2b9\ud654 \uc5b8\uc5b4(DSL)\ub97c \ub9cc\ub4e4\uc790. \uadf8\ub7ec\uba74 \uadf8\ub9cc\ud07c \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uc9dc\uae30\uac00 \uc26c\uc6cc\uc9c4\ub2e4."}),"\n",(0,t.jsx)(n.p,{children:"\ud14c\uc2a4\ud2b8 \ucf54\ub4dc\uac00 \ubc29\uce58\ub418\uc5b4 \ub9dd\uac00\uc9c0\uba74 \uc2e4\uc81c \ucf54\ub4dc\ub3c4 \ub9dd\uac00\uc9c4\ub2e4. \ud14c\uc2a4\ud2b8 \ucf54\ub4dc\ub97c \uae68\ub057\ud558\uac8c \uc720\uc9c0\ud558\uc790."})]})}function h(e={}){const{wrapper:n}={...(0,a.a)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},1151:(e,n,s)=>{s.d(n,{Z:()=>c,a:()=>i});var t=s(7294);const a={},r=t.createContext(a);function i(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function c(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(a):e.components||a:i(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);