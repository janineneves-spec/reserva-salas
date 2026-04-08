'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const C = {
  yellow: '#F5C518',
  dark: '#0f0f1a',
  card: '#1a1a2e',
  gray: '#2d2d44',
  lightgray: '#3d3d5c',
  white: '#f0f0f0',
  green: '#22c55e',
  red: '#ef4444',
  finaya: '#a855f7',
  builders: '#F5C518',
  visitante: '#3b82f6',
  outros: '#6b7280',
}

const COMPANY_OPTIONS = [
  { value: 'finaya',    label: 'Finaya',    color: C.finaya   },
  { value: 'builders',  label: 'Builders',  color: C.builders },
  { value: 'visitante', label: 'Visitante', color: C.visitante},
  { value: 'outros',    label: 'Outros',    color: C.outros   },
]

const DESK_LAYOUT = [
  { name: 'Mesa 1', x: 388, y: 108, w: 46, h: 34 },
  { name: 'Mesa 2', x: 438, y: 108, w: 46, h: 34 },
  { name: 'Mesa 3', x: 488, y: 108, w: 46, h: 34 },
  { name: 'Mesa 4', x: 388, y: 146, w: 46, h: 34 },
  { name: 'Mesa 5', x: 438, y: 146, w: 46, h: 34 },
  { name: 'Mesa 6', x: 488, y: 146, w: 46, h: 34 },
  { name: 'Mesa 7',  x: 500, y: 240, w: 44, h: 34 },
  { name: 'Mesa 8',  x: 500, y: 278, w: 44, h: 34 },
  { name: 'Mesa 9',  x: 500, y: 316, w: 44, h: 34 },
  { name: 'Mesa 10', x: 452, y: 240, w: 44, h: 34 },
  { name: 'Mesa 11', x: 452, y: 278, w: 44, h: 34 },
  { name: 'Mesa 12', x: 452, y: 316, w: 44, h: 34 },
  { name: 'Mesa 13', x: 390, y: 240, w: 44, h: 34 },
  { name: 'Mesa 14', x: 390, y: 278, w: 44, h: 34 },
  { name: 'Mesa 15', x: 390, y: 316, w: 44, h: 34 },
  { name: 'Mesa 16', x: 342, y: 240, w: 44, h: 34 },
  { name: 'Mesa 17', x: 342, y: 278, w: 44, h: 34 },
  { name: 'Mesa 18', x: 342, y: 316, w: 44, h: 34 },
  { name: 'Mesa 19', x: 248, y: 130, w: 44, h: 34 },
  { name: 'Mesa 20', x: 248, y: 168, w: 44, h: 34 },
  { name: 'Mesa 21', x: 248, y: 206, w: 44, h: 34 },
  { name: 'Mesa 22', x: 248, y: 244, w: 44, h: 34 },
  { name: 'Mesa 23', x: 200, y: 130, w: 44, h: 34 },
  { name: 'Mesa 24', x: 200, y: 168, w: 44, h: 34 },
  { name: 'Mesa 25', x: 200, y: 206, w: 44, h: 34 },
  { name: 'Mesa 26', x: 200, y: 244, w: 44, h: 34 },
  { name: 'Mesa 27', x: 152, y: 130, w: 44, h: 34 },
  { name: 'Mesa 28', x: 152, y: 168, w: 44, h: 34 },
  { name: 'Mesa 29', x: 152, y: 206, w: 44, h: 34 },
  { name: 'Mesa 30', x: 152, y: 244, w: 44, h: 34 },
  { name: 'Mesa 31', x: 104, y: 130, w: 44, h: 34 },
  { name: 'Mesa 32', x: 104, y: 168, w: 44, h: 34 },
  { name: 'Mesa 33', x: 104, y: 206, w: 44, h: 34 },
  { name: 'Mesa 34', x: 104, y: 244, w: 44, h: 34 },
]

const ROOMS = [
  { name: 'Sala So Bora',     x: 650, y: 30,  w: 120, h: 100, doorSide: 'left', desc: '2 posições + sofá',      capacity: 'até 3 pessoas',  icon: '🔇', blocked: false },
  { name: 'Sala de Reuniao',  x: 650, y: 180, w: 120, h: 110, doorSide: 'left', desc: 'Mesa grande',            capacity: 'até 10 pessoas', icon: '📋', blocked: false },
  { name: 'Sala do Andrezao', x: 650, y: 340, w: 120, h: 80,  doorSide: 'left', desc: 'Reservado — André',      capacity: '1 pessoa',       icon: '🔒', blocked: true  },
  { name: 'Sala Im Capivaya', x: 30,  y: 430, w: 145, h: 80,  doorSide: 'top',  desc: '1 mesa + quadro branco', capacity: 'até 4 pessoas',  icon: '🦦', blocked: false },
  { name: 'Sala Im Finayer',  x: 185, y: 430, w: 130, h: 80,  doorSide: 'top',  desc: '1 mesa',                 capacity: 'até 2 pessoas',  icon: '⚡', blocked: false },
  { name: 'Sala Im Builder',  x: 325, y: 430, w: 145, h: 80,  doorSide: 'top',  desc: '2 mesas + sofá',         capacity: 'até 4 pessoas',  icon: '🔨', blocked: false },
]

const STATIONS = [
  { label: 'Estação 1',  x: 376, y: 92,  w: 172, h: 102, color: '#F5C518' },
  { label: 'Prancha A',  x: 440, y: 224, w: 116, h: 140, color: '#3b82f6' },
  { label: 'Prancha B',  x: 330, y: 224, w: 106, h: 140, color: '#3b82f6' },
  { label: 'Estação 2',  x: 320, y: 206, w: 242, h: 166, color: '#60a5fa' },
  { label: 'Estação 3',  x: 90,  y: 114, w: 216, h: 176, color: '#a855f7' },
]

function companyColor(company: string) {
  switch(company) {
    case 'finaya':    return C.finaya
    case 'builders':  return C.builders
    case 'visitante': return C.visitante
    default:          return C.outros
  }
}

function DoorMark({ room }: { room: typeof ROOMS[0] }) {
  const s = 14
  if (room.doorSide === 'left')
    return <rect x={room.x-4} y={room.y+room.h/2-s/2} width={8} height={s} fill={C.yellow} rx={2}/>
  return <rect x={room.x+room.w/2-s/2} y={room.y-4} width={s} height={8} fill={C.yellow} rx={2}/>
}

function formatDate(d: string) {
  if (!d) return ''
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const fieldStyle = {
  background: '#1a1a2e', border: '1px solid #555577', borderRadius: 10,
  padding: '12px', color: '#f0f0f0', fontSize: 20, textAlign: 'center' as const,
  width: '100%', boxSizing: 'border-box' as const, outline: 'none',
}

export default function Home() {
  const [desks, setDesks]               = useState<any[]>([])
  const [reservations, setReservations] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [dia, setDia]                   = useState('')
  const [mes, setMes]                   = useState('')
  const [ano, setAno]                   = useState('')
  const [personName, setPersonName]     = useState('')
  const [company, setCompany]           = useState('finaya')
  const [selected, setSelected]         = useState<any>(null)
  const [message, setMessage]           = useState('')
  const [msgType, setMsgType]           = useState<'ok'|'err'|'warn'|''>('')
  const [hovered, setHovered]           = useState<string|null>(null)
  const [step, setStep]                 = useState<1|2|3>(1)

  useEffect(() => { fetchDesks() }, [])
  useEffect(() => {
    if (selectedDate) { fetchReservations(); setSelected(null); setMessage('') }
  }, [selectedDate])

  function trySetDate(d: string, m: string, a: string) {
    if (d.length===2 && m.length===2 && a.length===4) {
      setSelectedDate(`${a}-${m}-${d}`)
      setStep(2)
    }
  }

  async function fetchDesks() {
    const { data } = await supabase.from('desks').select('*').order('id')
    setDesks(data || [])
  }

  async function fetchReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .or(`date.eq.${selectedDate},permanent.eq.true`)
    setReservations(data || [])
  }

  function getDB(name: string) { return desks.find(d => d.name === name) }

  function getReservation(name: string) {
    const d = getDB(name); if (!d) return null
    return reservations.find(r => r.desk_id === d.id) ?? null
  }

  function isReserved(name: string) { return !!getReservation(name) }
  function reservedBy(name: string)  { return getReservation(name)?.person_name ?? null }
  function reservedCompany(name: string) { return getReservation(name)?.company ?? null }

  const totalSpaces    = DESK_LAYOUT.length + ROOMS.filter(r => !r.blocked).length
  const totalReserved  = reservations.filter(r => !r.permanent || r.date === selectedDate).length
  const totalAvailable = totalSpaces - reservations.length

  async function handleReserve() {
    if (!selected || !selectedDate || !personName) {
      setMessage('Preencha seu nome e selecione um espaço.'); setMsgType('warn'); return
    }
    if (isReserved(selected.name)) {
      setMessage('Já reservado nesta data.'); setMsgType('err'); return
    }
    const d = getDB(selected.name); if (!d) return
    const { error } = await supabase.from('reservations').insert({
      desk_id: d.id, date: selectedDate, person_name: personName, company
    })
    if (error) { setMessage('Erro ao reservar.'); setMsgType('err') }
    else {
      setMessage(`${selected.name} reservado para ${personName}!`)
      setMsgType('ok'); setSelected(null); fetchReservations()
    }
  }

  function deskFill(name: string) {
    if (selected?.name === name) return companyColor(company)
    const co = reservedCompany(name)
    if (co) return companyColor(co) + '55'
    return C.lightgray
  }
  function deskStroke(name: string) {
    if (selected?.name === name) return companyColor(company)
    const co = reservedCompany(name)
    if (co) return companyColor(co)
    if (hovered === name) return C.yellow
    return '#555577'
  }
  function roomFill(room: any) {
    if (room.blocked) return '#111122'
    const co = reservedCompany(room.name)
    if (selected?.name === room.name) return companyColor(company) + '33'
    if (co) return companyColor(co) + '33'
    return '#16213e'
  }
  function roomStroke(room: any) {
    if (room.blocked) return '#444466'
    if (selected?.name === room.name) return companyColor(company)
    const co = reservedCompany(room.name)
    if (co) return companyColor(co)
    if (hovered === room.name) return C.yellow
    return '#334466'
  }

  return (
    <main style={{ minHeight:'100vh', background:C.dark, padding:'24px', fontFamily:'system-ui,sans-serif' }}>
      <div style={{ maxWidth:880, margin:'0 auto' }}>

        <div style={{ marginBottom:32 }}>
          <h1 style={{ color:C.yellow, fontSize:26, fontWeight:800, margin:0 }}>🏢 Reserva — Finaya × Builders</h1>
          <p style={{ color:'#8888aa', margin:'4px 0 0', fontSize:14 }}>Siga os 3 passos para reservar seu espaço</p>
        </div>

        {/* PASSO 1 */}
        <div style={{ background:step===1?C.gray:'#1a2a1a', border:`1px solid ${step===1?C.yellow:C.green}`,
          borderRadius:16, padding:'20px 24px', marginBottom:16, display:'flex', gap:16 }}>
          <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0,
            background:step>1?C.green:C.yellow, display:'flex', alignItems:'center',
            justifyContent:'center', fontWeight:800, fontSize:16, color:C.dark }}>
            {step>1?'✓':'1'}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ color:C.white, fontWeight:700, fontSize:16, marginBottom:14 }}>Qual data você quer reservar?</div>
            {step===1 ? (
              <div>
                <div style={{ display:'flex', gap:10, alignItems:'flex-end', maxWidth:320 }}>
                  <div style={{ flex:1 }}>
                    <label style={{ color:'#8888aa', fontSize:11, display:'block', marginBottom:4 }}>DIA</label>
                    <input value={dia} maxLength={2} placeholder="DD" style={fieldStyle}
                      onChange={e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,2); setDia(v); trySetDate(v,mes,ano) }}/>
                  </div>
                  <span style={{ color:'#555577', fontSize:24, paddingBottom:10 }}>/</span>
                  <div style={{ flex:1 }}>
                    <label style={{ color:'#8888aa', fontSize:11, display:'block', marginBottom:4 }}>MÊS</label>
                    <input value={mes} maxLength={2} placeholder="MM" style={fieldStyle}
                      onChange={e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,2); setMes(v); trySetDate(dia,v,ano) }}/>
                  </div>
                  <span style={{ color:'#555577', fontSize:24, paddingBottom:10 }}>/</span>
                  <div style={{ flex:2 }}>
                    <label style={{ color:'#8888aa', fontSize:11, display:'block', marginBottom:4 }}>ANO</label>
                    <input value={ano} maxLength={4} placeholder="AAAA" style={fieldStyle}
                      onChange={e=>{ const v=e.target.value.replace(/\D/g,'').slice(0,4); setAno(v); trySetDate(dia,mes,v) }}/>
                  </div>
                </div>
                <p style={{ color:'#555577', fontSize:12, marginTop:8 }}>O mapa abre automaticamente ao preencher a data.</p>
              </div>
            ) : (
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <span style={{ color:C.yellow, fontWeight:700, fontSize:18 }}>📅 {formatDate(selectedDate)}</span>
                <button onClick={()=>{ setStep(1); setSelected(null); setMessage('') }}
                  style={{ background:'none', border:'1px solid #444466', borderRadius:8,
                    color:'#8888aa', fontSize:13, padding:'4px 12px', cursor:'pointer' }}>Alterar</button>
              </div>
            )}
          </div>
        </div>

        {/* PASSO 2 */}
        {step>=2 && (
          <div style={{ background:C.gray, border:`1px solid ${step===2?C.yellow:'#333355'}`,
            borderRadius:16, padding:'20px 24px', marginBottom:16, display:'flex', flexDirection:'column', gap:16 }}>
            <div style={{ display:'flex', gap:16, alignItems:'center' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0,
                background:step>2?C.green:C.yellow, display:'flex', alignItems:'center',
                justifyContent:'center', fontWeight:800, fontSize:16, color:C.dark }}>
                {step>2?'✓':'2'}
              </div>
              <div style={{ color:C.white, fontWeight:700, fontSize:16 }}>Escolha seu espaço no mapa</div>
            </div>

            <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
              {[{v:totalAvailable,l:'disponíveis',bg:'#1a2e1a',c:C.green},{v:totalReserved,l:'reservados',bg:'#2e1a1a',c:C.red},{v:totalSpaces,l:'total',bg:C.card,c:C.white}].map(i=>(
                <div key={i.l} style={{ background:i.bg, border:`1px solid ${i.c}`, borderRadius:12, padding:'10px 20px', textAlign:'center' }}>
                  <div style={{ color:i.c, fontWeight:800, fontSize:24 }}>{i.v}</div>
                  <div style={{ color:'#8888aa', fontSize:11, marginTop:2 }}>{i.l}</div>
                </div>
              ))}
            </div>

            {/* Legenda empresas */}
            <div style={{ display:'flex', gap:14, flexWrap:'wrap' }}>
              {COMPANY_OPTIONS.map(c=>(
                <span key={c.value} style={{ display:'flex', alignItems:'center', gap:6, color:'#aaaacc', fontSize:12 }}>
                  <span style={{ width:14, height:14, borderRadius:3, background:c.color+'55',
                    border:`2px solid ${c.color}`, display:'inline-block' }}/>{c.label}
                </span>
              ))}
              <span style={{ display:'flex', alignItems:'center', gap:6, color:'#aaaacc', fontSize:12 }}>
                <span style={{ width:14, height:14, borderRadius:3, background:C.lightgray,
                  border:'2px solid #555577', display:'inline-block' }}/>Disponível
              </span>
            </div>

            <div style={{ background:'#13132a', borderRadius:12, padding:12, overflowX:'auto', border:'1px solid #333355' }}>
              <svg width="790" height="540" style={{ minWidth:580, display:'block' }}>
                <rect x="10" y="10" width="768" height="515" rx="10" fill="#13132a" stroke="#222244" strokeWidth="1.5"/>
                <rect x="355" y="10" width="70" height="10" rx="3" fill={C.yellow}/>
                <text x="390" y="34" textAnchor="middle" fontSize="10" fill={C.yellow} fontWeight="bold">PORTA</text>
                <rect x="650" y="430" width="120" height="60" rx="6" fill="#111122" stroke="#333355" strokeWidth="1.5"/>
                <text x="710" y="465" textAnchor="middle" fontSize="11" fill="#555577">ESTOQUE</text>

                {[STATIONS[4], STATIONS[0], STATIONS[3], STATIONS[1], STATIONS[2]].map(s=>(
                  <g key={s.label}>
                    <rect x={s.x} y={s.y} width={s.w} height={s.h} rx={8}
                      fill="none" stroke={s.color} strokeWidth="1.5" strokeDasharray="6,3" opacity={0.6}/>
                    <rect x={s.x+6} y={s.y-9} width={s.label.length*6.4+10} height={17} rx={4} fill="#13132a"/>
                    <text x={s.x+11} y={s.y+2} fontSize="9" fill={s.color} fontWeight="bold">{s.label}</text>
                  </g>
                ))}

                {DESK_LAYOUT.map(desk=>{
                  const res=isReserved(desk.name), by=reservedBy(desk.name)
                  const co=reservedCompany(desk.name), sel=selected?.name===desk.name
                  return (
                    <g key={desk.name}
                      onClick={()=>{ if(!res){setSelected(desk);setStep(3)} }}
                      onMouseEnter={()=>setHovered(desk.name)}
                      onMouseLeave={()=>setHovered(null)}
                      style={{ cursor:res?'not-allowed':'pointer' }}>
                      <rect x={desk.x} y={desk.y} width={desk.w} height={desk.h} rx={5}
                        fill={deskFill(desk.name)} stroke={deskStroke(desk.name)} strokeWidth={sel?2.5:1.5}/>
                      <text x={desk.x+desk.w/2} y={desk.y+desk.h/2-(by?5:0)} textAnchor="middle"
                        fontSize="9" fontWeight={sel?'bold':'normal'}
                        fill={sel?C.dark:res?C.white:'#ccccee'}>
                        {desk.name.replace('Mesa ','')}
                      </text>
                      {by&&<text x={desk.x+desk.w/2} y={desk.y+desk.h/2+6} textAnchor="middle" fontSize="7"
                        fill={co?companyColor(co):C.white}>{by}</text>}
                    </g>
                  )
                })}

                {ROOMS.map(room=>{
                  const res=isReserved(room.name), by=reservedBy(room.name)
                  const co=reservedCompany(room.name), sel=selected?.name===room.name, blocked=room.blocked
                  return (
                    <g key={room.name}
                      onClick={()=>{ if(!blocked&&!res){setSelected({...room});setStep(3)} }}
                      onMouseEnter={()=>setHovered(room.name)}
                      onMouseLeave={()=>setHovered(null)}
                      style={{ cursor:blocked||res?'not-allowed':'pointer' }}>
                      <rect x={room.x} y={room.y} width={room.w} height={room.h} rx={8}
                        fill={roomFill(room)} stroke={roomStroke(room)} strokeWidth={sel?2.5:1.5}
                        strokeDasharray={blocked?'6,3':'none'}/>
                      <DoorMark room={room}/>
                      <text x={room.x+room.w/2} y={room.y+22} textAnchor="middle" fontSize="16">{room.icon}</text>
                      <text x={room.x+room.w/2} y={room.y+40} textAnchor="middle" fontSize="10" fontWeight="bold"
                        fill={blocked?'#555577':sel?companyColor(company):res&&co?companyColor(co):C.white}>
                        {room.name.replace('Sala Im',"I'm").replace('Sala ','')}
                      </text>
                      <text x={room.x+room.w/2} y={room.y+54} textAnchor="middle" fontSize="8" fill="#8888aa">{room.desc}</text>
                      <text x={room.x+room.w/2} y={room.y+67} textAnchor="middle" fontSize="8"
                        fill={sel?companyColor(company):co?companyColor(co):'#777799'}>
                        {by?`${by}`:room.capacity}
                      </text>
                    </g>
                  )
                })}
              </svg>
            </div>
          </div>
        )}

        {/* PASSO 3 */}
        {step>=3 && selected && (
          <div style={{ background:C.gray, border:`1px solid ${companyColor(company)}`,
            borderRadius:16, padding:'20px 24px', display:'flex', gap:16 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', flexShrink:0, background:companyColor(company),
              display:'flex', alignItems:'center', justifyContent:'center', fontWeight:800, fontSize:16, color:C.dark }}>3</div>
            <div style={{ flex:1 }}>
              <div style={{ color:C.white, fontWeight:700, fontSize:16, marginBottom:14 }}>Confirme sua reserva</div>

              <div style={{ background:'#1a1a2e', borderRadius:10, padding:'12px 16px',
                borderLeft:`3px solid ${companyColor(company)}`, marginBottom:16 }}>
                <div style={{ color:companyColor(company), fontWeight:700, fontSize:15 }}>{selected.name}</div>
                {selected.desc&&<div style={{ color:'#8888aa', fontSize:13, marginTop:3 }}>{selected.desc}</div>}
                {selected.capacity&&<div style={{ color:'#8888aa', fontSize:13 }}>👥 {selected.capacity}</div>}
                <div style={{ color:'#8888aa', fontSize:13, marginTop:4 }}>📅 {formatDate(selectedDate)}</div>
              </div>

              <div style={{ display:'flex', gap:12, flexWrap:'wrap', marginBottom:14 }}>
                <div style={{ flex:1, minWidth:180 }}>
                  <label style={{ color:'#aaaacc', fontSize:12, display:'block', marginBottom:6 }}>SEU NOME</label>
                  <input value={personName} onChange={e=>setPersonName(e.target.value)} placeholder="Ex: Janine"
                    style={{ width:'100%', background:'#1a1a2e', border:'1px solid #555577', borderRadius:8,
                      padding:'10px 14px', color:C.white, fontSize:14, boxSizing:'border-box' as const }}/>
                </div>
                <div style={{ flex:1, minWidth:180 }}>
                  <label style={{ color:'#aaaacc', fontSize:12, display:'block', marginBottom:6 }}>EMPRESA</label>
                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {COMPANY_OPTIONS.map(opt=>(
                      <button key={opt.value} onClick={()=>setCompany(opt.value)}
                        style={{ padding:'8px 14px', borderRadius:8, border:`2px solid ${opt.color}`,
                          background: company===opt.value ? opt.color : 'transparent',
                          color: company===opt.value ? C.dark : opt.color,
                          fontWeight:700, fontSize:13, cursor:'pointer', transition:'all 0.15s' }}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button onClick={handleReserve}
                style={{ background:companyColor(company), color:C.dark, fontWeight:800, fontSize:15,
                  padding:'10px 28px', borderRadius:10, border:'none', cursor:'pointer', width:'100%' }}>
                Confirmar ✓
              </button>

              {message&&(
                <p style={{ marginTop:12, fontSize:13, fontWeight:600,
                  color:msgType==='ok'?C.green:msgType==='err'?C.red:'#f59e0b' }}>
                  {msgType==='ok'?'✅':msgType==='err'?'❌':'⚠️'} {message}
                </p>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  )
}