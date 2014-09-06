var data = [];

//Función que se llama cuando se presiona el botón "Enviar"
function generatePlot()
{
	//Obtenemos el FacebookID desde el input con id fbid
	var fbid = document.getElementById("fbid").value;
	
	//Obtenemos el Token desde el input con id token
	var token = document.getElementById("token").value;
	
	//Campos que queremos obtener con la consulta
	var fields = "name,likes.limit(1000),photos.limit(1000),statuses.limit(50),friends{birthday,gender,address,relationship_status,age_range},picture.height(400),age_range"

	//Consulta
	var req = "https://graph.facebook.com/v1.0/" + fbid + "?access_token=" + token + "&fields=" + fields + "&format=json&method=get&pretty=0&suppress_http_code=1"


	//Creamos una nueva variable para manejar la consulta
	
	var xhr = new XMLHttpRequest();

	//En req tiene que estar almacenada la consulta
	xhr.open('get', req);
	 
	//Suscribimos la siguiente función al evento "cambio de estado" de la variable que maneja la consulta.
	 xhr.onreadystatechange = function(){
		// Ready state 4 means the request is done
		if(xhr.readyState === 4){
			// 200 is a successful return
			//Este es el código que se ejecutará una vez que la consulta sea respondida sin problemas
			if(xhr.status === 200){
			
				//En xhr.responseText está la respuesta. En este caso es en JSON así que la parseamos para transformarla a un objeto javascript
				var response = JSON.parse(xhr.responseText);
				
				//Obtenemos la cantidad de amigos, likes, fotos y estados.
				var friends = response.friends.data.length;
				var likes = response.likes.data.length;
				var photos = response.photos.data.length;
				var statuses = response.statuses.data;
				var photo = response.picture.data.url;
                var name = response.name;
                var amigos = response.friends.data;
                var age = response.age_range.max;

                //estatus
                console.log(statuses)
                console.log(statuses[0].message)
                var palabras_en_status = [];
                for( a=0; a < statuses.length; a++ )
					{ var mensaje = statuses[a].message;
						mensaje=mensaje.split(" ");
						for( e=0; e < mensaje.length; e++ )
						{ 
							palabras_en_status.push(mensaje[e].toLowerCase());
						}
					}
				for( e=0; e < palabras_en_status.length; e++ )
						{ var lista = [palabras_en_status[e], palabras_en_status.filter(function(value) { return value == palabras_en_status[e] }).length];
					    console.log(lista)
						  palabras_en_status[e] = lista;
						}
				console.log(palabras_en_status);

                //contar male female
                var contador;
                var male = [];
                var female = [];
                for( contador=0; contador < friends.length; contador++ )
					{
  						if( amigos[contador].gender == "male") {
  						male.unshift(amigos[contador]);
						}
    					if( amigos[contador].gender == "female") {
  						female.unshift(amigos[contador]);
						}
					}
				var num_male = male.length;
                var num_female = female.length;
                console.log(num_male)
                console.log(num_female)
				// numero de cumpleanos por mes
				var cumpleanos = [];
				for (x=0;x<amigos.length;x++){
					for (i=0;i<amigos[x].length;i++){
						console.log(amigos[x][i])
						console.log("hola")
						if(amigos[x][i] == "birthday"){
       					 		cumpleanos.push(amigos[x].birthday);
       					 	}
					}
				}
				var num_cumple = [0,0,0,0,0,0,0,0,0,0,0,0];
				for (x=0;x<cumpleanos.length;x++){
					var count = 0;
    				if(parseInt(cumpleanos[x].substring(0,2)) == x+1){
       					count++};
       				num_cumple[x]+=count
       			}
       			//relacion

				//nombre
				document.getElementById("nombre").innerHTML = "Hola " + name;
				//poner foto perfil
				console.log(photo)
                document.getElementById("foto-perfil").innerHTML = "<img scr=" + photo + ">";
                //edad
                document.getElementById("edad").innerHTML = "<p>Tu edad es: " + age + "</p>";
				
				//Agregamos al arreglo	los datos obtenidos en el formato indicado por el creador de la librería para poder agregar los datos al gráfico
				data.push(
				  {
					axes: [
					  {axis: "likes", value: likes}, 
					  {axis: "photos", value: photos}, 
					  {axis: "friends", value: friends},  
					  {axis: "statuses", value: statuses}
					]
				  }
				);
				
				//Usamos el método de la librería para crear el gráfico e insertarlo en el div de clase "chart-container"
				RadarChart.draw(".chart-container", data);
				//Grafico torta male female copiado de http://jsfiddle.net/clockworked247/c2Dp2/14/
var chart;
$(document).ready(function() {
    
/* PIE CHART THEME */
Highcharts.theme = {
   /* LINE/BAR/COLUMN/SLICE COLORS - only used for slices for Plex, if we add multiple data sets in future releases, these colors will work with the rendering of other sets */
   colors: ['#395C9B', '#923532'],
    
   /* CHART TITLE */
   title: {
      style: {
         color: '#000',
         font: 'bold 16px "Lucida Grande", Helvetica, Arial, sans-serif'
      }
   },

   /* CHART SUBTITLE */
   subtitle: {
      style: {
         color: '#666666',
         font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
      }
   },
    
   /* CHART X-AXIS */
   xAxis: {
      lineColor: '#000',
      tickColor: '#000',
      labels: {
         style: {
            color: '#000',
            font: '11px "Lucida Grande", Helvetica, Arial, sans-serif'
         }
      },
      title: {
         style: {
            color: '#333',
            font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
         }
      }
   },
    
   /* CHART Y-AXIS */
   yAxis: {
      minorTickInterval: 'false', /* OPTIONAL PARAMETER - SHOWS HORIZONTAL LINES in between tick values */
      lineColor: '#000',
      lineWidth: 1,
      tickWidth: 1,
      tickColor: '#000',
      labels: {
         style: {
            color: '#000',
            font: '11px "Lucida Grande", Helvetica, Arial, sans-serif'
         }
      },
      title: {
         style: {
            color: '#333',
            font: 'bold 12px "Lucida Grande", Helvetica, Arial, sans-serif'
         }
      }
   },
    
   /* LINE CHART COLORS */
   plotOptions: {
       line: {
           lineWidth: 3,
           shadow: false,
           marker: {
                fillColor: '#fff', /* LINE POINT COLOR */
                lineWidth: 2,
                radius: 4,
                symbol: 'circle', /* "circle", "square", "diamond", "triangle" and "triangle-down" */
                lineColor: null // inherit from above defined colors
           }
       },
       column: {
          cursor: 'pointer',
           borderColor: '#333',
           borderWidth: 1,
           shadow: false
       },
       bar: {
          cursor: 'pointer',
          borderColor: '#333',
          borderWidth: 1,
          shadow: false
       },
       pie: {
          cursor: 'pointer',
          borderColor: '#666',
          borderWidth: 1,
          shadow: false
       }
   }    
}; 
    
// Apply the theme
var highchartsOptions = Highcharts.setOptions(Highcharts.theme);        
    
    chart = new Highcharts.Chart({
        chart: {
            renderTo: 'container',
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        title: {
            text: 'Grafico amigos male v/s female'
        },
        subtitle: {
            text: ''
        },  
        series: [{
            type: 'pie',
            name: 'Browser share',
            data: [
                ['male',   num_male],
                ['female',       num_female],
            ]
        }]
    });
});
			}else{
				alert('Error: '+xhr.status); // An error occurred during the request
			}
		}
	}
	 
	//Enviamos la consulta
	xhr.send(null);
}
