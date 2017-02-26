(function (global) {
'use strict'

var socket = io.connect('http://localhost:3000'); 

var calenderDiv = document.getElementById('calender');
var monthTitle = document.querySelector('h1');
var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', "Ноябрь", "Декабрь"]
var currentDate = new Date();
var currentMonth = currentDate.getMonth();
var currentYear = currentDate.getFullYear();
var nextMonth = currentMonth + 1;
var lastMonthYear = currentDate.getFullYear();

function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}
console.log(currentDate);

var daysInCurrentMonth = daysInMonth(currentMonth, currentYear);

console.log(daysInCurrentMonth);

function Calender(prepod) {
    this.prepod = prepod;
    this.allLessonDays = [];
}

// создаем календарь в ДОМ-дереве

function createCalender (daysInCurrentMonth) {
    for (var i = 0; i < daysInCurrentMonth; i++) {
    var cDay = document.createElement('div');
    cDay.setAttribute('class', 'calenderDay');
    var dayNumP = document.createElement('p');
    var dayNumT = document.createTextNode(i+1);
    cDay.setAttribute('id', i+1);
    dayNumP.setAttribute('id', "p" + (i+1));
    dayNumP.appendChild(dayNumT);
    cDay.appendChild(dayNumP);
    calenderDiv.appendChild(cDay);
    monthTitle.innerHTML = months[currentMonth] + " " + currentYear;
}}

// функция для правильного формирования календаря - с понедельника

function findMonday (currentMonth, currentYear) {
    for (var i = 0; i < 7; i++) {
    var thatDate = new Date (currentYear, currentMonth, i);
var thatDateofWeek = thatDate.getDay();
console.log(thatDateofWeek);

if (thatDateofWeek === 0) {
    console.log(i);
 for (var counter = 0; counter < (7-i); counter++) {
var cDay = document.createElement('div');
cDay.setAttribute('class', 'calenderDay');
var dayNumP = document.createElement('p');
cDay.appendChild(dayNumP);
calenderDiv.appendChild(cDay);
  
}}}}




// конструктор для заполнения календаря уроками

function Prepod(name, dtStart, dtEnd, nameBlock, nameBlockColor) { 
this.name = name;
this.dtStart = dtStart;
this.dtStartMonth = this.dtStart.substring(5,7);
this.dtStartDay = this.dtStart.substring(8,10);
this.dtEnd = dtEnd;
this.dtEndMonth = this.dtEnd.substring(5,7);
this.dtEndDay = this.dtEnd.substring(8,10);
this.lessonDays = [];
this.nameBlock = nameBlock;
this.nameBlockColor = nameBlockColor;
}

// вносим в календарь уроки

Calender.prototype.fillSelectedDays = function(i) {
     this.allLessonDays.push(i);
    console.log(this.allLessonDays);
    var cDaySelected = document.getElementById(i);
    // cDaySelected.className += " selectedDay";
    cDaySelected.style.background = this.prepod.nameBlockColor;
    var textDiv = document.createElement("div");
    textDiv.id = 'textDiv';
    textDiv.innerHTML = this.prepod.name + '<br>' + this.prepod.nameBlock;
    cDaySelected.appendChild(textDiv);
    var closeButton = document.createElement('button');
    closeButton.addEventListener('click', function() {cDaySelected.removeChild(textDiv); cDaySelected.style.background = 'white'; });
    var closeSign = document.createTextNode('x');
    closeButton.appendChild(closeSign);
    closeButton.className += " closeBtn";
    textDiv.appendChild(closeButton);
}


// Генерируем расписание препода/курса

Calender.prototype.getSelectedDays = function(){
    console.log(+this.prepod.dtStartMonth-1, currentMonth, this.prepod.name)
if (+this.prepod.dtStartMonth-1 == currentMonth) {
            for (var i = 1; i <= daysInCurrentMonth; i++) {
            var thatDate = new Date (currentYear, currentMonth, i);
                var thatDateofWeek = thatDate.getDay();
        for (var counter=0; counter < this.prepod.lessonDays.length; counter++)  {
                if (+this.prepod.dtEndMonth == currentMonth) {
                               
                        if (+this.prepod.dtEndDay >= i && i >= +this.prepod.dtStartDay && thatDateofWeek == this.prepod.lessonDays[counter])  {  
                        this.fillSelectedDays(i);            
                        } 
                            } else { console.log(this.prepod.name, this.prepod.lessonDays, this.prepod.lessonDays[counter], thatDateofWeek); 
                               
                                if ( i <= +this.prepod.dtEndDay && thatDateofWeek == this.prepod.lessonDays[counter])  {  
                                        this.fillSelectedDays(i);                                         
     } } } } } 

else if(+this.prepod.dtStartMonth < currentMonth && +this.prepod.dtEndMonth == currentMonth) {
     for (var i = 1; i <= daysInCurrentMonth; i++) {
            var thatDate = new Date (currentYear, currentMonth, i);
                var thatDateofWeek = thatDate.getDay();
        for (var counter=0; counter < this.prepod.lessonDays.length; counter++)  {
                                       
                        if (+this.prepod.dtEndDay >= i && thatDateofWeek == this.prepod.lessonDays[counter])  {  
                        this.fillSelectedDays(i);            
                        } 
                             else { console.log(this.prepod.name, this.prepod.lessonDays, this.prepod.lessonDays[counter], thatDateofWeek); 
                             
}}}}}


findMonday(currentMonth, currentYear); //создаем календарь на текущий месяц
 createCalender(daysInCurrentMonth);

// Работа с сокетами

// Обработка новых данных формы для отправки на сервер в базу данных

document.getElementById('submitBtn').onclick = function() { 
alert('Нажата кнопка'); 
var dt_start = document.getElementById('courseStrtDt').value, 
dt_end = document.getElementById('courseEndtDt').value, 
name = document.getElementById('teacherName').value, 
color = document.getElementById('courseColor').value,
title =  document.getElementById('courseName').value
var weekDays = [];
$(".weekDaysBox:checked").each(function() {
    weekDays.push(this.value);
});
weekDays.toString();


console.log(weekDays)

socket.emit('add_event', { 
'dt_start': dt_start, 
'dt_end': dt_end, 
'name': name, 
'color': color,
'title': title,
'weekDays': weekDays
}); 
} 

// Обработка данных из базы с сервера для генерацииив календарь 

 var x = {};

socket.on('initial events', function (data){
    console.log('soket is on for initial events');
    var html = ''
   
    x = data;
        for (var i = 0; i < data.length; i++){
            html += '<li>' + 'Start' + data[i].dt_start + 'End' + data[i].dt_end + data[i].name + data[i].title + data[i].color + '</li>';
            var prepod = new Prepod(data[i].name, data[i].dt_start, data[i].dt_end, data[i].title, data[i].color);  // вопрос: как задавать массив в новом объекте?
            var weekDaysString = data[i].weekDays;            
            prepod.lessonDays = weekDaysString.split(',');
            console.log(prepod);
            var calender1 = new Calender(prepod); 
            calender1.getSelectedDays();    
                          
        }
        $('#test').html(html)
       
        return x
    })



// кнопки для пролистывания месяцев

var buttonBack = document.getElementById('arrow-left');
var buttonNext = document.getElementById('arrow-right');
 
buttonBack.addEventListener('click', createLastMonthCalender);
buttonNext.addEventListener('click', createNextMonthCalender);

// пролистывание назад



function createLastMonthCalender () {
    console.log("прошедший месяц");
    if (currentMonth != 0)  {
    console.log(currentMonth);
    currentMonth -= 1;
     console.log(currentMonth, currentYear);
    } else {
        currentMonth = 11;
        currentYear -=1;
        console.log(currentMonth,currentYear)
    }
    var daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    console.log(currentMonth, daysInCurrentMonth);
     calenderDiv.innerHTML = '';
    findMonday(currentMonth, currentYear);
    createCalender(daysInCurrentMonth);
    monthTitle.innerHTML = months[currentMonth] + " " + currentYear + " год";
   
       console.log("socket on!")
          for (var i = 0; i < x.length; i++){
            var prepod = new Prepod(x[i].name, x[i].dt_start, x[i].dt_end, x[i].title, x[i].color);  // вопрос: как задавать массив в новом объекте?
            var weekDaysString = x[i].weekDays;            
            prepod.lessonDays = weekDaysString.split(',');
            var calender1 = new Calender(prepod); 
            calender1.getSelectedDays();                    
 } }

// пролистывание вперед

function createNextMonthCalender () {
    console.log("следующий месяц");
    console.log(x);
if (currentMonth == 11) {
    console.log(currentMonth, currentYear);
    currentMonth = 0;
    currentYear += 1;
    console.log(currentMonth, currentYear);
} else {
    console.log(currentMonth);
     currentMonth += 1;
    console.log(currentMonth, currentYear);
}
        var daysInCurrentMonth = daysInMonth(currentMonth, currentYear);
    console.log(daysInCurrentMonth);
     calenderDiv.innerHTML = '';
    findMonday(currentMonth, currentYear);
    createCalender(daysInCurrentMonth);
    monthTitle.innerHTML = months[currentMonth] + " " + currentYear + " год";
console.log("I am here before the soket");
     
       console.log(x);
          for (var i = 0; i < x.length; i++){
            var prepod = new Prepod(x[i].name, x[i].dt_start, x[i].dt_end, x[i].title, x[i].color);  // вопрос: как задавать массив в новом объекте?
            var weekDaysString = x[i].weekDays;            
            prepod.lessonDays = weekDaysString.split(',');
            var calender1 = new Calender(prepod); 
            calender1.getSelectedDays();                    
 } 
            
                            
 }


 
} (window));

