// ==UserScript==
// @name        New script - goo.ne.jp
// @namespace   Violentmonkey Scripts
// @match       https://dictionary.goo.ne.jp/word/*
// @grant       none
// @version     1.0
// @author      -
// @description 9/11/2022, 7:49:51 PM
// ==/UserScript==

// The document isn't loaded on first event
let FIRST_RUN = true
const DELIMITERS = '⓪①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳㉑㉒㉓㉔㉕㉖㉗㉘㉙㉚㉛㉜㉝㉞㉟㊱㊲㊳㊴㊵㊶㊷㊸㊹㊺㊻㊼㊽㊾㊿';

function parse_meaning(text, newline) {
  const buf = []
  const chars = [...text]
  
  chars.forEach(char => {
    if (DELIMITERS.includes(char) && buf.length) {
      buf.push(newline)
    }
    buf.push(char)
  })
  
  const formatted_text = buf.join('')
  return formatted_text
}

function get_meaning(newline) {
  const meaning_blocks = document.getElementsByClassName('meaning_block')
  
  if (meaning_blocks.length !== 1) {
    throw new Error()
  }
  const meaning_block = meaning_blocks[0]
  const meaning_p_list = meaning_block.querySelectorAll('.block > .inner_block > p')
  
  if (meaning_p_list.length !== 1) {
    throw new Error()
  }
  const meaning_p = meaning_p_list[0]
  const meaning = parse_meaning(meaning_p.innerHTML, newline)
  return meaning
}

function get_readings() {
  const dl_list = document.querySelectorAll('.reads > dl')
  
  if (dl_list.length !== 1) {
    throw new Error()
  }
  const dl = dl_list[0]
  
  if (dl.children.length !== 4) {
    throw new Error()
  }
  const [on_label, on_data, kun_label, kun_data] = dl.children
  const on_html = on_data.innerHTML.trim()
  const kun_html = kun_data.innerHTML.trim()
  return `【音】${on_html}【訓】${kun_html}`
}

function write_to_log() {
  // const readings = get_readings()
  const meaning = get_meaning('\n')
  console.clear()
  console.log(`検定\n${meaning}`)
}

function format_text() {
  const meaning = get_meaning('<br/>')
  const readings = get_readings()
  const element = document.querySelector('.meaning_block .block')
  element.innerHTML = `検定${readings}<br/>${meaning}`
}

function add_button() {
  const divider = document.getElementById('kanji_kanken-_')
  
  if (!divider) {
    return
  }
  const title = divider.previousElementSibling
  const button = document.createElement('button')
  button.innerText = '刷る'
  button.onclick = format_text // write_to_log
  title.append(button)
}

function main() {
  try {
    add_button()
    console.log('DONE')
  } catch (e) {
    console.error(e)
    alert('Violentmonkey script failed')
  }
}

window.addEventListener('load', main)
