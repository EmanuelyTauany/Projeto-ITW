const { formatDate } = require("fullcalendar/index.js");

document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale:'pt-br',
        headerToolBar : {
          left:'prev, next today',
          center:'title',
          right:'dayGridMonth, timeGridWeek, timeGridDay'
        },
        slotMinTime: '08:00:00',
        slotMaxTime: '16:00:00',
        slotDuration: '01:00:00',
        allDaySlot: false,
        selectable: true,
        selectMirror: true,
        selectOverlap: false,

        select: function(info){
          selecaoAtual = info;

          const dataFormatada = info.start.toLocalDateString('pt-BR');
          const horarioInicio = info.start.toLocaleTimeString('pt-BR', {hour: '2-digit', minute:'2-digit'});
          const horaFim = info.end.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'});

          horarioSelecionadoEl.textContent =
          `Data: ${dataFormatada}\nHorário: ${horaInicio}' - ${horaFim}`;
          modal.style.display = 'block';
          calendar.unselect();
        },
        
        eventClick : function(info){
          alert('Evento: ' + info.envent.title + '\n' +
                 'Início: ' + info.event.start.toLocaleString('pt-BR')
          );
        },

        buttonText: {
              today:'Hoje',
              month:'Mês',
              week: 'Semana',
              day: 'Dia'
        }

    });
    calendar.render();

    cancelarBtn.addEventListener('click', function(){
      modal.style.display = 'none';
      selecaoAtual = null;
    });

    formAgendamento.addEventListener('submit', function(e){
      e.preventDefault();

      if(!selecaoAtual) return;

      calendar.addEvent({
        title: 'Consulta - ' + document.getElementById('nome').value,
        start: selecaoAtual.start,
        end: selecaoAtual.end,
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50'
      });

      console.log('Agendamento confirmado:', {
        nome: document.getElementById('nome').value,
        telefone: document.getElementById('telefone').value,
        inicio: selecaoAtual.end.toISOString()
      });

      modal.style.display = 'none';
      formAgendamento.reset();
      selectAtual = null;

      alert('Agendamento confirmado com sucesso!');


    });
});