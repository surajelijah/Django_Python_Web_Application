var auto_location="";
var table_created=0;
var event_card_created=0;
var venue_card_created=0;
var arrow_head_created=0;
var table_received_data="";
var venue_g="";
var venue_address_g=""
var event_clicks=0;
var genre_clicks=0;
var venue_clicks=0;



function add_location_label(){

    var form_=document.getElementById("event_form");
    var ipinfo_key="ee8392e5a888a4";
    if( document.getElementById("location_checkbox").checked ){
        
        var location_ = document.getElementById("location");
        form_.removeChild(location_);

        // Call for the current Locations
        var xmlrequest= new XMLHttpRequest();

        xmlrequest.onreadystatechange = function(){

        if(xmlrequest.readyState==4 && xmlrequest.status==200){
            var received_data=JSON.parse(xmlrequest.responseText);
            auto_location=received_data.loc;
        }
    }

    xmlrequest.open("GET","https://ipinfo.io/?token=" + ipinfo_key);
    xmlrequest.send();

    }
    else{
        var location_box=document.createElement('input');
        location_box.className="input_box_style";
        location_box.id="location";
        location_box.required=1;

        form_.appendChild(location_box);
    }

    console.log("Auto Location Detection Check");
}

function table_clear(){

    if(table_created==1){
        var table_div=document.getElementById("table_div");
        table_div.removeChild(document.getElementById("event_table"));
        table_created=0;
    }

}

function event_card_clear(){

    if(event_card_created==1){
        var event_card_=document.getElementById("event_card_");
        event_card_.removeChild(document.getElementById("event_card"));
        event_card_created=0;
    }
}

function venue_card_clear(){
    if(venue_card_created==1){
        var venue_card_=document.getElementById("venue_card_");
        venue_card_.removeChild(document.getElementById("venue_card"));
        venue_card_created=0;
    }
}

function arrow_head_clear(){
    if(arrow_head_created==1){
        var arrow_=document.getElementById("show_arrow");
        arrow_.removeChild(document.getElementById("show_venue_details"));
        arrow_head_created=0;
    }
}


function form_clear(){

    var form_=document.getElementById("event_form");
    /*Code for clearing the fields */

    var keyword=document.getElementById("keyword");
    keyword.value="";

    var distance=document.getElementById("distance");
    distance.value="";

    var category=document.getElementById("category");
    category.value="Default";

    var location_checkbox=document.getElementById("location_checkbox");
    location_checkbox.checked=0;

    var location=document.getElementById("location")
    if(document.getElementById("location")!=null){
        var location= document.getElementById("location");
        location.value="";
    }
    else{
        var location_box=document.createElement('input');
        location_box.className="input_box_style";
        location_box.id="location";
        location_box.required=1;

        form_.appendChild(location_box);
       
    }

    console.log("Clear Function check");
    /* Remember to add the code for clearing the result section */

    table_clear();
    event_card_clear();
    venue_card_clear();
    arrow_head_clear();
}

function call_googlemaps(){

    console.log(venue_address_g);
    window.open("https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(venue_address_g),target="_blank");
}


function venue_card_display(received_data){

    var venue_card_=document.getElementById("venue_card_");
    
    var venue_card=document.createElement("div");
    venue_card.id="venue_card";
    var venue_b=document.createElement("div");
    venue_b.id="venue_inside_border";

    var venue_title=document.createElement("div");
    venue_title.id="venue_card_title"
    if('name' in received_data)
        venue_title.innerHTML='<u>'+received_data['name']+'</u>';
    else
        venue_title.innerHTML='<u>'+venue_g+'</u>';

    var adrress_details=document.createElement("div");
    adrress_details.id="address_details";

    var address=document.createElement("div");
    address.id="address";
    address.innerHTML="Address: "


    var address_value=document.createElement("div");
    address_value.id="address_value";

    var gmaps=document.createElement("div");
    gmaps.id="gmaps";
    var gmaps_url=document.createElement("a");

    if('address' in received_data && received_data['address'].length!=0 && 'city' in received_data && received_data['city'].length!=0 && 'pc' in received_data && received_data['pc'].length!=0){
        var line=document.createElement("div");
        line.innerHTML=received_data['address'];


        var city=document.createElement("div");
        city.innerHTML=received_data['city'];

        var pc=document.createElement("div");
        pc.innerHTML=received_data['pc']

        address_value.appendChild(line);
        address_value.appendChild(city);
        address_value.appendChild(pc);

        gmaps_url.id="google_maps";
        gmaps_url.innerHTML="Open in Google Maps";
        gmaps_url.setAttribute("onclick","call_googlemaps()");

        venue_address_g=received_data['address'] + ', ' + received_data['city'] +', '+received_data['pc'];
    }
    else{
        gmaps.innerHTML="N/A";
        address.innerHTML="Address:N/A";
    }

    gmaps.appendChild(gmaps_url);
    adrress_details.appendChild(address);
    adrress_details.appendChild(address_value);
    adrress_details.appendChild(gmaps);


    var upcoming_events = document.createElement("div");
    upcoming_events.id="upcoming_events";

    var events_url=document.createElement("a");
    events_url.id="events_url";
    if('uc' in received_data && received_data['uc'].length!=0){
        events_url.href=received_data['uc'];
        events_url.setAttribute("target","_blank");
        events_url.innerHTML="More Events at this venue";
    }
    else{
        events_url.innerHTML="N/A";
    }
    upcoming_events.appendChild(events_url);

    venue_b.appendChild(venue_title);
    venue_b.appendChild(document.createElement("br"));
    venue_b.appendChild(adrress_details);
    venue_b.appendChild(upcoming_events);

    venue_card.appendChild(venue_b);

    //Arrow head code to put the venue card
    var arrow_head=document.getElementById("show_arrow");
    arrow_head.removeChild(document.getElementById("show_venue_details"));
    arrow_head_created=0;    


    venue_card_.appendChild(venue_card);

    venue_card_created=1;
}


function create_event_card_details(title_v,name,event_card,received_data){
    
    if(title_v in received_data){
        var title=document.createElement("p");
        title.id="event_card_values";
        title.innerHTML=name;

        var title_content=document.createElement("p");
        title_content.id="event_card_content";
        title_content.innerHTML=received_data[title_v];
        if(title_v=="Venue"){
            venue_g=received_data[title_v];
        }
        event_card.appendChild(title);
        event_card.appendChild(title_content);
    }
}

function create_venue_card(){

    console.log("Clicked  for Venue Card");

    var xmlrequest= new XMLHttpRequest();

    var parameterstring={
        'venue':venue_g,
    }
    xmlrequest.onreadystatechange = function(){

        if(xmlrequest.readyState==4 && xmlrequest.status==200){
            console.log("Data send from the Server");
            var received_data=JSON.parse(xmlrequest.responseText);
            console.log(received_data);

            venue_card_display(received_data);
            var venue_card=document.getElementById("venue_card");
            venue_card.scrollIntoView({block: "end", inline: "nearest",behavior:'smooth'});

        }
    }

    xmlrequest.open("GET","/venue?data=" + JSON.stringify(parameterstring));
    xmlrequest.send();

}

function event_details_card_display(received_data){

    var event_card_=document.getElementById("event_card_");

    var event_card=document.createElement("div");
    event_card.id="event_card";

    var event_title=document.createElement("h1");
    event_title.id="event_card_title";
    event_title.innerHTML=received_data.name;
    event_card.appendChild(event_title);

    var event_card_details=document.createElement("div");
    event_card_details.id="event_card_details"


    var event_card_image = document.createElement("div");
    event_card_image.id="event_card_image";

    create_event_card_details('Date','Date',event_card_details,received_data);
    if('AT_URL' in received_data){
        
        var title=document.createElement("p");
        title.id="event_card_values";
        title.innerHTML="Artist/Team";

        var at_url=document.createElement("a");
        at_url.id="event_card_values_bta";
        at_url.innerHTML=received_data['AT'];
        at_url.href=received_data['AT_URL'];
        at_url.target="_blank";

        event_card_details.appendChild(title);
        event_card_details.appendChild(at_url);
    }
    else{
        create_event_card_details('AT','Artist/Team',event_card_details,received_data);
    }
    create_event_card_details('Venue','Venue',event_card_details,received_data);
    create_event_card_details('Genres','Genres',event_card_details,received_data);
    create_event_card_details('PR','Price Ranges',event_card_details,received_data);


    if('TS' in received_data){
        var title=document.createElement("p");
        title.id="event_card_values";
        title.innerHTML="Ticket Status";

        var title_content=document.createElement("div");
        title_content.id="event_card_content_ts";
        var status=received_data['TS'];
        if(status=="onsale"){
            title_content.style.backgroundColor='rgb(60, 179, 113)';
            title_content.innerHTML="On Sale";
        }
        else if(status=="offsale"){
            title_content.style.backgroundColor='red';
            title_content.innerHTML="Off Sale";
        }
        else if(status=="canceled"){
            title_content.style.backgroundColor='black';
            title_content.innerHTML="Canceled";
        }
        else if(status=="postponed"){
            title_content.style.backgroundColor='rgb(255, 165, 0)';
            title_content.innerHTML="Postponed";
        }
        else if(status == "rescheduled"){
            title_content.style.backgroundColor='rgb(255, 165, 0)';
            title_content.innerHTML="Rescheduled";
        }

        event_card_details.appendChild(title);
        event_card_details.appendChild(title_content);
    }

    if('BTA' in received_data){
        var title=document.createElement("p");
        title.id="event_card_values";
        title.innerHTML="Buy Ticket At:";

        var title_content=document.createElement("a");
        title_content.id="event_card_values_bta";
        title_content.innerHTML="Ticketmaster";
        title_content.href=received_data['BTA'];
        title_content.target="_blank";

        event_card_details.appendChild(title);
        event_card_details.appendChild(title_content);
    }

    event_card.appendChild(event_card_details);

    var event_card_image=document.createElement("div");
    event_card_image.id="event_card_image";

    if('SM' in received_data){
    var place=document.createElement("img");
    place.src=received_data['SM'];
    place.id="place_image";

    event_card_image.appendChild(place);
    }
    event_card.appendChild(event_card_image);

    event_card_.appendChild(event_card);

    event_card_created=1;

    //The Arrow head 

    if(arrow_head_created==1){
        arrow_head_clear();
    }

    var show_arrow=document.getElementById("show_arrow");

    var sv=document.createElement("div");
    sv.id="show_venue_details";

    var st=document.createElement("h1");
    st.id="show_venue_title";
    st.innerHTML="Show Venue Details";

    var arrow_head=document.createElement("div");
    arrow_head.id="arrow_head";
    arrow_head.setAttribute("onclick","create_venue_card()");

    sv.appendChild(st);
    sv.appendChild(arrow_head);


    show_arrow.appendChild(sv);
    arrow_head_created=1;

}


function display_event_details(event_id){

    console.log(event_id);
    console.log(document.getElementById(event_id).innerHTML);

    var parameterstring={
        'id':event_id,
    }

    var xmlrequest= new XMLHttpRequest();

    xmlrequest.onreadystatechange = function(){

        if(xmlrequest.readyState==4 && xmlrequest.status==200){
            var received_data=JSON.parse(xmlrequest.responseText);
            console.log(received_data);

            if(event_card_created==1)
                event_card_clear();
            
            if(venue_card_created==1)
                venue_card_clear();
            
            event_details_card_display(received_data);
            var event_card=document.getElementById("event_card");
            event_card.scrollIntoView();
        }
    }

    xmlrequest.open("GET","/event?data=" + JSON.stringify(parameterstring));
    xmlrequest.send();

    console.log("Event Data Received");
}


function sort_data(detail){
    
    var order=0;

    if(detail=='event'){
        if(event_clicks%2 == 0)
            order=0;
        else
            order=1;
        event_clicks+=1;
    }
    else if(detail == 'genre'){
        if(genre_clicks%2 == 0)
            order=0;
        else
            order=1;
        genre_clicks+=1;
    }
    else{
        if(venue_clicks%2 == 0)
            order=0;
        else
            order=1;
        venue_clicks+=1;
    }

    if(order==0){
    
        table_received_data['events'].sort((event_a,event_b)=>{
        if(event_a[detail] < event_b[detail])
            return -1;
    });
    
    }
    else{
        table_received_data['events'].sort((event_a,event_b)=>{
            if(event_a[detail] > event_b[detail])
                return -1;
        });
    }
    table_clear();
    event_table_creation(table_received_data);
    console.log("Sorted");
}


function event_table_creation(received_data){

    var table_div=document.getElementById("table_div");
    var counter=1;

    if(table_created==1)
        return;

    if(received_data.events.length!=0 ){
        
        var event_table=document.createElement("table");
        event_table.id="event_table";

        var event_headers=document.createElement("tr");
        event_headers.className="event_table_headers";
        var date_header=document.createElement("th");
        var icon_header=document.createElement("th");
        var event_header=document.createElement("th");
        var genre_header=document.createElement("th");
        var venue_header=document.createElement("th");

        date_header.innerHTML="Date";
        icon_header.innerHTML="Icon";
        event_header.innerHTML="Event";
        genre_header.innerHTML="Genre";
        venue_header.innerHTML="Venue";


        //Adding onClick to sort the data based on event genre or venue
        event_header.setAttribute("onclick","sort_data('event')");
        genre_header.setAttribute("onclick","sort_data('genre')");
        venue_header.setAttribute("onclick","sort_data('venue')");

        event_header.className="clickable_sort";
        genre_header.className="clickable_sort";
        venue_header.className="clickable_sort";

        event_table.appendChild(event_headers);

        event_headers.appendChild(date_header);
        event_headers.appendChild(icon_header);
        event_headers.appendChild(event_header);
        event_headers.appendChild(genre_header);
        event_headers.appendChild(venue_header);


        for(event_ of received_data['events']){

            var event_row=document.createElement("tr");

            var date_content=document.createElement("td");
            date_content.className="td_date";
            var icon_content=document.createElement("td");
            icon_content.className="td_icon";
            var event_content=document.createElement("td");
            event_content.className="td_event";
            var genre_content=document.createElement("td");
            genre_content.className="td_genre";
            var venue_content=document.createElement("td");
            venue_content.className="td_venue";


            date_content.innerHTML = '<p>'+ event_['date'] +'</p>' + '<p>'+ event_['time'] +'</p>';


            var icon_img=document.createElement("img");
            icon_img.className="icon_images";
            icon_img.src=event_['icon'];

            icon_content.appendChild(icon_img);

            var event_link= document.createElement("p");
            event_link.id=event_['event_id'];
            event_link.className="clickable_event"
            counter+=1;
            event_link.innerHTML=event_['event'];
            event_link.setAttribute("onclick","display_event_details(this.id)");
            
            event_content.appendChild(event_link);

            genre_content.innerHTML=event_['genre'];
            venue_content.innerHTML=event_['venue'];

            event_row.appendChild(date_content);
            event_row.appendChild(icon_content);
            event_row.appendChild(event_content);
            event_row.appendChild(genre_content);
            event_row.appendChild(venue_content);

            event_table.appendChild(event_row);
        }

        table_div.appendChild(event_table);
        table_created=1;
    }
    else{
        var event_table=document.createElement("table");
        event_table.id="event_table";

        var event_headers=document.createElement("tr");
        
        var noevent_header=document.createElement("th");
        noevent_header.innerHTML="No Records found";
        noevent_header.id="noevent";

        event_headers.appendChild(noevent_header);
        event_table.appendChild(event_headers);

        table_div.appendChild(event_table);
        table_created=1;
    }

}


function data_fetch(){

    var keyword=document.getElementById("keyword").value;
    var distance=document.getElementById("distance").value;
    if(distance=="")
        distance=10;

    var category=document.getElementById("category").value;

    if(document.getElementById("location_checkbox").checked){
        /*get the coordinate location using the hashcode or geohash or send them to the python script and calculate*/

        var location=0;
    }
    else{
        var location =document.getElementById("location").value;/* Sending this to Python script and getting processing*/
    }

    var parameterstring={

        "keyword" : keyword,
        "distance": distance,
        "category": category,
        "location": location,
        "auto_location":auto_location,
    };

    var xmlrequest= new XMLHttpRequest();

    xmlrequest.onreadystatechange = function(){

        if(xmlrequest.readyState==4 && xmlrequest.status==200){
            console.log("Data send from the Server");
            var received_data=JSON.parse(xmlrequest.responseText);
            console.log(received_data);

            if(table_created==1){
                table_clear();
            }
            if(event_card_created==1){
                event_card_clear();
            }
            if(venue_card_created==1){
                venue_card_clear();
            }
            if(arrow_head_created==1){
                arrow_head_clear();
            }
            table_received_data=received_data;
            event_table_creation(received_data);
        }
    }

    xmlrequest.open("GET","/search?data=" + JSON.stringify(parameterstring));
    xmlrequest.send();

    console.log("Entered the data_fetch function");
    console.log(parameterstring);
    return false;
}

