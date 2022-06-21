// ==UserScript==
// @name        New script - goo.ne.jp
// @namespace   Violentmonkey Scripts
// @match       https://dictionary.goo.ne.jp/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/20/2022, 9:46:39 PM
// ==/UserScript==

document.body.onload = main

function fullWidthToNumber(str) {
  const callback = ch => String.fromCharCode(ch.charCodeAt(0) - 0xFEE0)
  return str.replace(/[\uff01-\uff5e]/g, callback)
}

function panic(msg, ...args) {
  console.log(args)
  alert(msg)
  throw new Error(msg)
}

function fixEnumeration(content) {
  let fixedOl = null

  return ol => {
    let [li, ...otherChildren] = ol.children
    
    if (otherChildren.length) {
      panic('There are other children in `ol`')
    }
    let [p, ...otherChildren2] = li.children
    
    if (otherChildren2.length) {
      panic('There are other children in `li`')
    }
    let [strong, ...otherChildren3] = p.children
    
    if (otherChildren3.length) {
      panic('There are other children in `p`')
    }
    let id = fullWidthToNumber(strong.innerHTML);
    
    if (isNaN(id)) {
      panic('ID is not a number', strong)
    }
    id = Number(id)

    if (id === 1) {
      fixedOl = ol
      console.log(fixedOl)
    }
    if (!fixedOl) {
      panic('Unable to find first `ol`', ol)
    }
    if (id !== 1) {
      fixedOl.appendChild(li)
      ol.remove()
    }
  }
}

function main() {
  const [content, ...otherContents] = document.getElementsByClassName('contents')
  
  if (otherContents.length) {
    panic('There are other conent')
  }
  let meanings = Array.from(content.children)
  meanings = Array.from(meanings)
  
  meanings = meanings
    .filter(el => el.tagName === 'OL')
    .filter(el => {
      if (el.className === 'meaning cx') {
        return true
      } else {
        panic('Unknown className of `ol` element')
      }
    })
  meanings.forEach(fixEnumeration(content))
}
