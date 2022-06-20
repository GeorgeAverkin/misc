// ==UserScript==
// @name        New script - goo.ne.jp
// @namespace   Violentmonkey Scripts
// @match       https://dictionary.goo.ne.jp/*
// @grant       none
// @version     1.0
// @author      -
// @description 6/20/2022, 9:46:39 PM
// ==/UserScript==

// document.addEventListener('onload', () => alert('ok'));
document.body.onload = main

function panic(msg) {
  alert(msg)
  throw new Error(msg)
}

function removeEnumeration(content) {
  return ol => {
    let [li, ...liChildren] = ol.children
    
    if (liChildren.length) {
      panic('There are other children in `ol`')
    }
    let [p, ...pChildren] = li.children
    
    if (pChildren.length) {
      panic('There are other children in `li`')
    }
    content.replaceChild(p, ol)
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
  meanings.forEach(removeEnumeration(content))
}
