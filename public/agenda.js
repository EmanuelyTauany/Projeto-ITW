document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    const modal = document.getElementById('modal-agendamento');
    const horarioSelecionadoEl = document.getElementById('horarioSelecionado');
    const formAgendamento = document.getElementById('form-agendamento');
    const cancelarBtn = document.getElementById('cancelar-btn');

    let selecaoAtual = null;
    
    const atendimentos = {
      'Fisioterapêutico':[2],
      'Psicológico': [2,4],
      'Pedagógico': [1,4]

    }

    const coresAtendimento = {
      'Fisioterapêutico': '#42a5f5',
      'Psicológico': '#66bb6a',
      'Pedagógico': '#ffa726'
    }

    const obterTipoAtendimento = (dia) => {
      for (let tipo in atendimentos){
        if(atendimentos[tipo].includes(dia)){
          return tipo;
        } 
      }

      return null;
    };

    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        height: 'auto',
        contentHeight: 'auto',
        expandRows: false,
        locale:'pt-br',
        
        slotMinTime: '08:00:00',
        slotMaxTime: '16:00:00',
        slotDuration: '01:00:00',
        allDaySlot: false,
        selectable: true,
        selectMirror: true,
        selectOverlap: false,

        select: function(info){
          const dia = info.start.getDay();
          const tipo = obterTipoAtendimento(dia);
          
          
          if(!tipo){
            alert('Não há atendimento disponível neste dia');
            calendar.unselect();
            return;

          }
          
          selecaoAtual = info;

          const dataFormatada = info.start.toLocaleDateString('pt-BR');
          const horarioInicio = info.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
          const horarioFim = info.end.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});

          horarioSelecionadoEl.textContent =
          `Tipo: ${tipo} Data: ${dataFormatada}\nHorário: ${horarioInicio} - ${horarioFim}`;
          modal.style.display = 'block';
          calendar.unselect();
        },
        selectAllow: function(selectInfo){
          const diaDaSemana = selectInfo.start.getDay();
          const diasPermitidos = Object.values(atendimentos).flat();
          return diasPermitidos.includes(diaDaSemana);
        },


        buttonText: {
              today:'Hoje',
              month:'Mês',
              week: 'Semana',
              day: 'Dia'
        }

    });

   async function carregarEventosSalvos(){
    try{
      const response = await fetch('https://projeto-itw.onrender.com/api/evento')
      
      if(!response.ok){
        throw new Error("Erro ao buscar eventos");
      }
      
      const eventos = await response.json();
      console.log(eventos);
      
      eventos.forEach(evento => {
        const inicio = new Date(evento.inicio);
        const fim = new Date(evento.fim);

        if(isNaN(inicio) || isNaN(fim)){
          console.warn("Evento ignorado por data inválida: ", evento)
        
          return;
        }

        calendar.addEvent({
          title: `Atendimento ${evento.tipo} - ${evento.nome}`,
          start: new Date (evento.inicio).toISOString(),
          end:  new Date (evento.fim).toISOString(),
          backgroundColor: coresAtendimento[evento.tipo],
          borderColor: coresAtendimento[evento.tipo],
          extendedProps:{
            tipo: evento.tipo,
            email: evento.email
          }
        })
      })


    }catch(err){
      console.error("Erro ao carregar eventos:", err.message);
    }
   }


    calendar.render();
    carregarEventosSalvos();

    cancelarBtn.addEventListener('click', function(){
      modal.style.display = 'none';
      selecaoAtual = null;
    });

    formAgendamento.addEventListener('submit', function(e){
      e.preventDefault();

      if(!selecaoAtual) return;

      const dia = selecaoAtual.start.getDay();
      const tipo = obterTipoAtendimento(dia);

      const nome = document.getElementById('nome').value;
      const email = document.getElementById('email').value;
      const telefone = document.getElementById('telefone').value;

      
      
       (async () => {
        try{
          const evento ={
            nome,
            email,
            tipo,
            telefone,
            inicio: selecaoAtual.start.toISOString(),
            fim: selecaoAtual.end.toISOString()
          };

          const response = await fetch('https://projeto-itw.onrender.com/api/evento', {
            method: 'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body: JSON.stringify(evento)

          });
          if(!response.ok){
            const erro = await response.text();
            throw new Error(erro);
          }

        calendar.addEvent({
        title: 'Atendimento ' + tipo + ' - ' + document.getElementById('nome').value,
        start: selecaoAtual.start,
        end: selecaoAtual.end,
        backgroundColor: coresAtendimento[tipo],
        borderColor: coresAtendimento[tipo],
        extendedProps: {
          tipo:tipo
        }
      });

      console.log('Agendamento confirmado:', {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        tipo,
        inicio: selecaoAtual.start.toISOString()
      });

      modal.style.display = 'none';
      formAgendamento.reset();
      selecaoAtual = null;

      alert('Agendamento confirmado com sucesso!');
        }catch(error){
         alert('Erro ao registrar agendamento' + error.message);
         console.error(error);
        }
       }) ();


    });
});