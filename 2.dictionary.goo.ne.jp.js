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
    const is_newline = DELIMITERS.includes(char)

    if (is_newline && buf.length) {
      buf.push(newline)
    }
    buf.push(char)
    
    if (is_newline) {
      buf.push('&nbsp;')
    }
  })
  
  const formatted_text = buf.join('')
  return formatted_text
}


class KankenDom {
  static get_meaning(newline) {
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

  static get_readings() {
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

  static get_info() {
    const dl_list = document.querySelectorAll('.info > dl')
    
    if (dl_list.length !== 1) {
      throw new Error()
    }
    const dl = dl_list[0]
    
    
    if (dl.children.length !== 8) {
      throw new Error()
    }
    const [
      busyu_label,
      busyu_data,
      kakusuu_label,
      kakusuu_data,
      syubetsu_label,
      syubetsu_data,
      kanken_label,
      kanken_data,
    ] = dl.children
    
    const kanken_html = kanken_data.innerHTML.trim()
    return `【${kanken_html}】`
  }
}

function write_to_log() {
  // const readings = get_readings()
  const meaning = get_meaning('\n')
  console.clear()
  console.log(`検定\n${meaning}`)
}

function format_text() {
  const meaning = KankenDom.get_meaning('<br/>')
  const readings = KankenDom.get_readings()
  const info = KankenDom.get_info()
  const element = document.querySelector('.meaning_block .block')
  element.innerHTML = `検定${info}${readings}<br/>${meaning}`
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
