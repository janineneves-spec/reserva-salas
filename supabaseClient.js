'use client'

import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const SPACES = [
  // Open space - bloco direito (mesas 1-18)
  { id_name: 'Mesa 1',  x: 370, y: 220, w: 52, h: 40 },
  { id_name: 'Mesa 2',  x: 430, y: 220, w: 52, h: 40 },
  { id_name: 'Mesa 3',  x: 490, y: 220, w: 52, h: 40 },
  { id_name: 'Mesa 4',  x: 370, y: 270, w: 52, h: 40 },
  { id_name: 'Mesa 5',  x: 430, y: 270, w: 52, h: 40 },
  { id_name: 'Mesa 6',  x: 490, y: 270, w: 52, h: 40 },
  { id_name: 'Mesa 7',  x: 550, y: 310, w: 40, h: 36 },
  { id_name: 'Mesa 8',  x: 550, y: 350, w: 40, h: 36 },
  { id_name: 'Mesa 9',  x: 550, y: 390, w: 40, h: 36 },
  { id_name: 'Mesa 10', x: 510, y: 310, w: 40, h: 36 },
  { id_name: 'Mesa 11', x: 510, y: 350, w: 40, h: 36 },
  { id_name: 'Mesa 12', x: 510, y: 390, w: 40, h: 36 },
  { id_name: 'Mesa 13', x: 470, y: 310, w: 40, h: 36 },
  { id_name: 'Mesa 14', x: 470, y: 350, w: 40, h: 36 },
  { id_name: 'Mesa 15', x: 470, y: 390, w: 40, h: 36 },
  { id_name: 'Mesa 16', x: 430, y: 310, w: 40, h: 36 },
  { id_name: 'Mesa 17', x: 430, y: 350, w: 40, h: 36 },
  { id_name: 'Mesa 18', x: 430, y: 390, w: 40, h: 36 },
  // Open space - bloco esquerdo (mesas 19-34)
  { id_name: 'Mesa 19', x: 200, y: 220, w: 44, h: 36 },
  { id_name: 'Mesa 20', x: 200, y: 260, w: 44, h: 36 },
  { id_name: 'Mesa 21', x: 200, y: 300, w: 44, h: 36 },
  { id_name: 'Mesa 22', x: 200, y: 340, w: 44, h: 36 },
  { id_name: 'Mesa 23', x: 155, y: 220, w: 44, h: 36 },
  { id_name: 'Mesa 24', x: 155, y: 260, w: 44, h: 36 },
  { id_name: 'Mesa 25', x: 155, y: 300, w: 44, h: 36 },
  { id_name: 'Mesa 26', x: 155, y: 340, w: 44, h: 36 },
  { id_name: 'Mesa 27', x: 248, y: 220, w: 44, h: 36 },
  { id_name: 'Mesa 28', x: 248, y: 260, w: 44, h: 36 },
  { id_name: 'Mesa 29', x: 248, y: 300, w: 44, h: 36 },
  { id_name: 'Mesa 30', x: 248, y: 340, w: 44, h: 36 },
  { id_name: 'Mesa 31', x: 100, y: 220, w: 44, h: 36 },
  { id_name: 'Mesa 32', x: 100, y: 260, w: 44, h: 36 },
  { id_name: 'Mesa 33', x: 100, y: 300, w: 44, h: 36 },
  { id_name: 'Mesa 34', x: 100, y: 340, w: 44, h: 36 },
  // Salas
  { id_name: 'Sala Só Bora',      x: 630, y: 30,  w: 110, h: 80,  isRoom: true },
  { id_name: 'Sala de Reunião',   x: 630, y: 200, w: 110, h: 100, isRoom: true },
  { id_name: 'Sala do Andrézão',  x: 630, y: 360, w: 110, h: 70,  isRoom: true, blocked: true },
  { id_name: 'Sala I\'m Capivaya',x: 30,  y: 460, w: 150, h: 70,  isRoom: true },
  { id_name: 'Sala I\'m Finayer', x: 190, y: 460, w: 130, h: 70,  isRoom: true },
  { id_name: 'Sala I\'m Builder', x: 330, y: 460, w: 150, h: 70,  isRoom: true },
]

export default function Home() {
  const [desks, setDesks] = useState<any[]>([])
  const [selectedDate, setSelectedDate] = useState('')
  const [personName, setPersonName] = useState('')
  const [selectedDesk, setSelectedDesk] = useState<any>(null)
  const [reservations, setReservations] = useState<any[]>([])
  const [message, setMessage] = useState('')
  const [msgType, setMsgType] = useState<'ok'|'err'|'warn'|''>('')

  useEffect(() => { fetchDesks() }, [])
  useEffect(() => { if (selectedDate) fetchReservations() }, [selectedDate])

  async function fetchDesks() {
    const { data } = await supabase.from('desks').select('*').order('id')
    setDesks(data || [])
  }

  async function fetchReservations() {
    const { data } = await supabase.from('reservations').select('*').eq('date', selectedDate)
    setReservations(data || [])
  }

  function getDeskData(name: string) {
    return desks.find(d => d.name === name)
  }

  function isReserved(name: string) {
    const d = getDeskData(name)
    if (!d) return false
    return reservations.some(r => r.desk_id === d.id)
  }

  function getReservedBy(name: string) {
    const d = getDeskData(name)
    if (!d) return null
    const r = reservations.find(r => r.desk_id === d.id)
    return r ? r.person_name : null
  }

  async function handleReserve() {
    if (!selectedDesk || !selectedDate || !personName) {
      setMessage('⚠️ Preencha seu nome, escolha uma data e selecione um espaço.')
      setMsgType('warn'); return
    }
    if (isReserved(selectedDesk.id_name)) {
      setMessage('❌ Este espaço já está reservado nesta data.')
      setMsgType('err'); return
    }
    const deskData = getDeskData(selectedDesk.id_name)
    if (!deskData) return
    const { error } = await supabase.from('reservations').insert({
      desk_id: deskData.id, date: selectedDate, person_name: personName,
    })
    if (error) {
      setMessage('❌ Erro ao reservar. Tente novamente.')
      setMsgType('err')
    } else {
      setMessage(`✅ ${selectedDesk.id_name} reservado para ${personName}!`)
      setMsgType('ok')
      setSelectedDesk(null)
      fetchReservations()
    }
  }

  function getSpaceColor(space: any) {
    if (space.blocked) return '#d1d5db'
    if (isReserved(space.id_name)) return '#fca5a5'
    if (selectedDesk?.id_name === space.id_name) return '#93c5fd'
    if (space.isRoom) return '#d1fae5'
    return '#e0f2fe'
  }

  function getSpaceStroke(space: any) {
    if (selectedDesk?.id_name === space.id_name) return '#2563eb'
    if (isReserved(space.id_name)) return '#ef4444'
    if (space.blocked) return '#9ca3af'
    if (space.isRoom) return '#059669'
    return '#7dd3fc'
  }

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">🏢 Reserva Finaya</h1>
          <p className="text-gray-500 mt-1">Clique em um espaço no mapa para reservar</p>
        </div>

        {/* Formulário */}
        <div className="bg-white rounded-2xl shadow p-5 mb-6 flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Seu nome</label>
              <input type="text" placeholder="Ex: Janine" value={personName}
                onChange={e => setPersonName(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
          </div>
          {selectedDesk && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 text-blue-800 text-sm">
              Selecionado: <strong>{selectedDesk.id_name}</strong>
            </div>
          )}
          <button onClick={handleReserve}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            Confirmar Reserva
          </button>
          {message && (
            <p className={`text-sm font-medium ${msgType==='ok'?'text-green-600':msgType==='err'?'text-red-500':'text-yellow-600'}`}>
              {message}
            </p>
          )}
        </div>

        {/* Legenda */}
        <div className="flex gap-4 mb-4 text-xs flex-wrap">
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded inline-block bg-blue-200 border border-blue-400"></span> Disponível</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded inline-block bg-blue-400 border-2 border-blue-600"></span> Selecionado</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded inline-block bg-red-300 border border-red-500"></span> Reservado</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded inline-block bg-green-200 border border-green-600"></span> Sala disponível</span>
          <span className="flex items-center gap-1"><span className="w-4 h-4 rounded inline-block bg-gray-300 border border-gray-400"></span> Bloqueado</span>
        </div>

        {/* MAPA */}
        <div className="bg-white rounded-2xl shadow p-4 overflow-x-auto">
          <svg width="780" height="560" className="w-full" style={{minWidth: 600}}>
            {/* Paredes externas */}
            <rect x="20" y="10" width="740" height="530" rx="8" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="2"/>
            {/* Porta */}
            <rect x="340" y="10" width="60" height="8" fill="#93c5fd" stroke="#3b82f6" strokeWidth="1"/>
            <text x="370" y="24" textAnchor="middle" fontSize="9" fill="#3b82f6" fontWeight="bold">PORTA</text>
            {/* Sofá modular */}
            <ellipse cx="390" cy="190" rx="35" ry="28" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.5"/>
            <text x="390" y="186" textAnchor="middle" fontSize="8" fill="#92400e">SOFÁ</text>
            <text x="390" y="197" textAnchor="middle" fontSize="8" fill="#92400e">MODULAR</text>
            {/* Estoque */}
            <rect x="630" y="440" width="110" height="60" rx="4" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="1.5"/>
            <text x="685" y="475" textAnchor="middle" fontSize="10" fill="#64748b">ESTOQUE</text>

            {/* Espaços clicáveis */}
            {SPACES.map((space) => {
              const reserved = isReserved(space.id_name)
              const reservedBy = getReservedBy(space.id_name)
              const isSelected = selectedDesk?.id_name === space.id_name
              const isBlocked = space.blocked || getDeskData(space.id_name)?.blocked

              return (
                <g key={space.id_name}
                  onClick={() => { if (!isBlocked && !reserved) setSelectedDesk(space) }}
                  style={{ cursor: isBlocked || reserved ? 'not-allowed' : 'pointer' }}>
                  <rect
                    x={space.x} y={space.y} width={space.w} height={space.h}
                    rx={space.isRoom ? 6 : 4}
                    fill={getSpaceColor(space)}
                    stroke={getSpaceStroke(space)}
                    strokeWidth={isSelected ? 2.5 : 1.5}
                  />
                  <text x={space.x + space.w/2} y={space.y + space.h/2 - (space.isRoom ? 6 : 2)}
                    textAnchor="middle" fontSize={space.isRoom ? 9 : 8}
                    fontWeight={space.isRoom ? 'bold' : 'normal'}
                    fill={isBlocked ? '#6b7280' : reserved ? '#dc2626' : '#1e40af'}>
                    {space.id_name.replace("Sala I'm ", "I'm ").replace("Sala ", "")}
                  </text>
                  {reserved && (
                    <text x={space.x + space.w/2} y={space.y + space.h/2 + 10}
                      textAnchor="middle" fontSize={7} fill="#dc2626">{reservedBy}</text>
                  )}
                  {isBlocked && (
                    <text x={space.x + space.w/2} y={space.y + space.h/2 + 10}
                      textAnchor="middle" fontSize={7} fill="#6b7280">🔒</text>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

      </div>
    </main>
  )
}