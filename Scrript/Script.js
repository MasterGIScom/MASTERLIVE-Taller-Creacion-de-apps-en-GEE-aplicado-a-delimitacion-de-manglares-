//1. Importar Layers de Interés 

var extent2000 = ee.Image('users/sergioingeo/Mangrove/2000PAMAMangroveExtent')
var extent2009 = ee.Image('users/sergioingeo/Mangrove/2009PAMAMangroveExtent')
var extent2019 = ee.Image('users/sergioingeo/Mangrove/2019PAMAMangroveExtent')
var hba = ee.Image('users/sergioingeo/Mangrove/Mangrove_CanopyPAMA')


// 2. Configurar la Apariencia del Mapa y layers
//2.1. Configuración del mapa

Map.setOptions('Satellite')

Map.centerObject(geometry,8)

// Cambiar el estilo del cursor a 'crosshair’ (retículo)
Map.style().set('cursor', 'crosshair');

//2.2.Configurar la Paleta de Colores “Viridis”
var viridis = {min: 0 , max : 25,palette : ['#481567FF','#482677FF','#453781FF','#404788FF','#39568CFF',
                                              '#33638DFF','#2D708EFF','#287D8EFF','#238A8DFF','#1F968BFF',
                                              '#20A387FF','#29AF7FFF','#3CBB75FF','#55C667FF',
                                              '#73D055FF','#95D840FF','#B8DE29FF','#DCE319FF','#FDE725FF' 
]};

//2.3. Crear Variables para Capas del Mapa en modo UI 

var simHBA = ui.Map.Layer(hba,viridis,'Simard Canopy Hba',false)
var ext2000 = ui.Map.Layer(extent2000, {palette:['6D63EB'], min:1, max:1}, 'Extent 2000',false)
var ext2009 = ui.Map.Layer(extent2009, {palette:['34BFDE'], min:1, max:1}, 'Extent 2010',false)
var ext2019 = ui.Map.Layer(extent2019, {palette:['71F4B7'], min:1, max:1}, 'Extent 2020',false)

// //Añadir las capas al mapa
Map.add(ext2000)
Map.add(ext2009)
Map.add(ext2019)
Map.add(simHBA)

//3. Configuración de Paneles con Texto

//Titulo de la APP
var header = ui.Label('Altura, Extención, Y cambio de Manglares en el litoral Norte Brasileño', 
            {fontSize: '25px', fontWeight: 'bold', color: '4A997E'});

//Resumen de la APP
var text = ui.Label(
  'Esta herramienta mapea la extensióm de los manglares en el litoral norte Brasileño en 2000, 2009, y 2020 usando una clasificación Random Forest a partir de imagenes Landsat. ' +
  'Use las herramientas a seguir para explorar cambios en la extensión de manglares y altura del dosel de manglares en 2000.',
    {fontSize: '15px'});


//Panel de Interfaz de Usuario
var panel = ui.Panel({
  widgets:[header, text],//Adds header and text
  style:{width: '300px',position:'middle-right'}});
  
//Crear Variables para Más Texto

var intro = ui.Panel([
  ui.Label({
    value: '___________________________________________',
    style: {fontWeight: 'bold',  color: '4A997E'},
  }),
  ui.Label({
    value:'Seleccionar capa para mostrar.',
    style: {fontSize: '15px', fontWeight: 'bold'}
  })]);

// //Agregar Paneles al Mapa
panel.add(intro)

ui.root.insert(1,panel)

//4. Construir Casillas de Verificación

//Etiqueta de las casillas de verificación
var extLabel = ui.Label({value:'Extensión de Manglar',
style: {fontWeight: 'bold', fontSize: '16px', margin: '10px 5px'}
});

//Adicionar casillas de verificación
var extCheck = ui.Checkbox('2000').setValue(false);

var extCheck2 = ui.Checkbox('2009').setValue(false);

var extCheck3 = ui.Checkbox('2019').setValue(false);

//Ahora hacemos lo mismo para el mapa de altura de la vegetación

var heightLab = ui.Label({value:'Altura de docel (Simard et al. 2019)',
style: {fontWeight: 'bold', fontSize: '16px', margin: '10px 5px'}
});

var heightCheck = ui.Checkbox('2000').setValue(false);

//Agregar leyendas

//Seleccionar una posición en el panel
var extentLegend = ui.Panel({
  style: {
    position: 'bottom-left',
    padding: '8px 15px'
  }
});

//Lo siguiente crea y estiliza una línea de la leyenda
var makeRowa = function(color, name) {
 
      //Crear la etiqueta que en realidad es el cuadro coloreado
      var colorBox = ui.Label({
        style: {
          backgroundColor: '#' + color,
          //  Use “padding” para darle ancho y alto al cuadro.
          padding: '8px',
          margin: '0 0 4px 0'
        }
      });
 
      // Cree una etiqueta con el texto de descripción.
      var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
      });
 
      // Regrese el panel
      return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
      });
};

//Crear una paleta usando los mismos colores que usamos para mapear las capas de extensión
var paletteMAPa = [
'6D63EB',//2000
'34BFDE',//2009
'71F4B7',//2019
];

//dar Nombre cada valor de la leyenda.
var namesa = ['2000','2009','2019']; 
//Agregue color y nombres a la leyenda.
for (var i = 0; i < 3; i++) {
  extentLegend.add(makeRowa(paletteMAPa[i], namesa[i]));
  }  

//Leyenda de Altura
function makeLegend2 (viridis) {
  var lon = ee.Image.pixelLonLat().select('longitude');
  var gradient = lon.multiply((viridis.max-viridis.min)/100.0).add(viridis.min);
  var legendImage = gradient.visualize(viridis);
  
  var thumb = ui.Thumbnail({
    image: legendImage, 
    params: {bbox:'0,0,100,8', dimensions:'256x20'},  
    style: {position: 'bottom-center'}
  });
  var panel2 = ui.Panel({
    widgets: [
      ui.Label('5 m'), 
      ui.Label({style: {stretch: 'horizontal'}}), 
      ui.Label('25 m')
    ],
    layout: ui.Panel.Layout.flow('horizontal'),
    style: {stretch: 'horizontal', maxWidth: '270px', padding: '0px 0px 0px 8px'}
  });
  return ui.Panel().add(panel2).add(thumb);
}

//Adicionar todos los widgets creados al panel principal.
panel.add(extLabel)
      .add(extCheck)
      .add(extCheck2)
      .add(extCheck3)
      .add(extentLegend)
      .add(heightLab)
      .add(makeLegend2(viridis))
      .add(heightCheck)

//5. Agregar funciones a las Casillas de Verificación

//Para cada casilla de verficicación debe crearse una función que al clickar active las capas

//Extensión en 2000
var doCheckbox = function() {
  
  extCheck.onChange(function(checked){
  ext2000.setShown(checked)
  })
}
doCheckbox();

//Extensión en 2009
var doCheckbox2 = function() {
  
  extCheck2.onChange(function(checked){
  ext2009.setShown(checked)
  })
  

}
doCheckbox2();

//Extensión en 20019
var doCheckbox3 = function() {
  
  extCheck3.onChange(function(checked){
  ext2019.setShown(checked)
  })
  

}
doCheckbox3();

//Datos de altura
var doCheckbox4 = function() {
  
  heightCheck.onChange(function(checked){
  simHBA.setShown(checked)

  })
  

}
doCheckbox4();

//6. Agrear una Herramienta de Inspector
//Crear un panel de inspector con una configuración horizontal
var inspector = ui.Panel({
  layout: ui.Panel.Layout.flow('horizontal')
});

// Agregar una etiqueta al panel.
inspector.add(ui.Label('Click para obtener la altura del dosel'));

// Agregar el panel al mapa preconfigurado.
Map.add(inspector);

// Crear Funcionalidad para el Inspector
Map.onClick(function(coords){
  
// Crear un panel y mostrar un mensaje de carga.
inspector.clear();
inspector.style().set('shown', true);
inspector.add(ui.Label('Cargando...', {color: 'gray'}));
  
//Computar el valor de altura del dosel 
var point = ee.Geometry.Point(coords.lon, coords.lat);
var reduce = hba.reduce(ee.Reducer.first());
var sampledPoint = reduce.reduceRegion(ee.Reducer.first(), point, 30);
var computedValue = sampledPoint.get('first');  

// Pedir el valor al servidor y usar los resultados en una función
computedValue.evaluate(function(result) {
inspector.clear();

// Agregar una etiqueta con los resultados del servidor
inspector.add(ui.Label({
      value: 'Altura (m): ' + result.toFixed(2),
      style: {stretch: 'vertical'}
    }));

//  Agregar un botón para ocultar el Panel.
    inspector.add(ui.Button({
      label: 'Close',
      onClick: function() {
        inspector.style().set('shown', false);
      }
    }));
  });
});

//7. Construir gráficos para medir la extensión en cada año
 //Calcular la superficie en hectareas para 2000
var get2000 = extent2000.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
      reducer:ee.Reducer.sum(),
      geometry:geometry,
      scale: 1000,
      maxPixels:1e13,
      tileScale: 16
      }).get('classification');
      

// Obtener el área para la región de interés
var feature = ee.Feature(geometry)
var feature2000 = feature.set('2000', ee.Number(get2000))



// Construir Gráfico de Barras

var chart2000 = ui.Chart.feature.byProperty(feature2000, ['2000'], ['Total'])

//Configurar título y etiquetas para el gráfico.
chart2000.setOptions({
  title: 'Área total de manglares',
  vAxis: {title: 'Área (ha)'},
  legend: {position: 'none'},
  hAxis: {
    title: 'Año',
    logScale: false
  }
});

// //2009
//Calculo del área
var get2009 = extent2009.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
      reducer:ee.Reducer.sum(),
      geometry:geometry,
      scale: 1000,
      maxPixels:1e13,
      tileScale: 16
      }).get('classification');
      

// Obtener el área para la región de interés
var feature2009 = feature.set('2009', ee.Number(get2009))



//Construir Gráfico de Barras

var chart2009 = ui.Chart.feature.byProperty(feature2009, ['2009'], ['Total'])

//Configurar título y etiquetas para el gráfico.
chart2009.setOptions({
  title: 'Área total de manglares',
  vAxis: {title: 'Área (ha)'},
  legend: {position: 'none'},
  hAxis: {
    title: 'Año',
    logScale: false
  }
});

// //2019

var get2019 = extent2019.multiply(ee.Image.pixelArea()).divide(10000).reduceRegion({
      reducer:ee.Reducer.sum(),
      geometry:geometry,
      scale: 1000,
      maxPixels:1e13,
      tileScale: 16
      }).get('classification');
      

var feature2019 = feature.set('2019', ee.Number(get2019))




var chart2019 = ui.Chart.feature.byProperty(feature2019, ['2019'], ['Total'])


chart2019.setOptions({
  title: 'Área total de manglar',
  vAxis: {title: 'Área (ha)'},
  legend: {position: 'none'},
  hAxis: {
    title: 'Año',
    logScale: false
  }
});

//8. Crear un menú desplegable para cada gráfico 
//Agregar un panel para contener los gráficos dentro del panel principal
var panelGraph = ui.Panel({
  style:{width: '300px',position:'middle-right'}
})



// Crear la leyenda de ítems para el menú desplegable
var y2000 = '2000'
var y2009 = '2009'
var y2019 = '2019'

// Construir Menú Desplegable
var graphSelect = ui.Select({
  items:[y2000,y2009,y2019],
  placeholder:'Escoja un Año',
  onChange: selectLayer,
  style: {position:'top-right'}
})

var constraints = []

//Escribir una fución para el Menú Desplegable
function selectLayer(){
  
  var graph = graphSelect.getValue() // Obtenga el valor de la selección del menú desplegable
  panelGraph.clear() //Despeje el panel del gráfico entre selecciones para que se visualice solo un gráfico
  
  //Usamos las frases “if else” para escribir instrucciones para dibujar gráficos
  if (graph == y2000){
    panelGraph.add(chart2000)
    
  }
  else if (graph == y2009){
    panelGraph.add(chart2009)

  }
  
  else if (graph == y2019){
    panelGraph.add(chart2019)
  }
  

  for (var i = 0; i < constraints.length; ++i) {
    var constraint = select[i];
    var mode = constraint.mode.getValue();
    var value = parseFloat(constraint.value.getValue());
    if (mode == GREATER_THAN) {
      image = image.updateMask(constraint.image.gt(value));
    } else {
      image = image.updateMask(constraint.image.lt(value));
    }
}
}

// Cree una nueva etiqueta

var graphLabel = ui.Label({value:'Selecciona el Año para mostrar la extensión de manglar',
style: {fontWeight: 'bold', fontSize: '16px', margin: '10px 5px'}
});


// Agregar el selector y el panel del gráfico al panel principal
panel.add(graphLabel)
      .add(graphSelect)
      .add(panelGraph)