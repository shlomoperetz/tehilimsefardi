import json, os

TITLES_ES = {
1:"Dichoso el hombre",2:"¿Por qué se agitan las naciones?",3:"Salmo de David al huir",
4:"Cuando te llamo, respóndeme",5:"Escucha mis palabras",6:"No me reproches en tu ira",
7:"Sigaión de David",8:"¡Cuán glorioso es tu Nombre!",9:"Te alabaré de todo corazón",
10:"¿Por qué, Eterno, te mantienes lejos?",11:"En el Eterno me refugio",12:"Sálvame, Eterno",
13:"¿Hasta cuándo, Eterno?",14:"Dice el necio en su corazón",15:"¿Quién morará en Tu monte?",
16:"Protégeme, Dios",17:"Oración de David",18:"Te amo, Eterno, fortaleza mía",
19:"Los cielos narran la gloria de Dios",20:"Que te responda el Eterno",
21:"El rey se alegra en Tu fortaleza",22:"Dios mío, Dios mío, ¿por qué me abandonas?",
23:"El Eterno es mi pastor",24:"Del Eterno es la tierra",25:"A Ti, Eterno, elevo mi alma",
26:"Júzgame, Eterno",27:"El Eterno es mi luz",28:"A Ti clamo, Eterno",
29:"Dad al Eterno, hijos de poderosos",30:"Te exaltaré, Eterno",
31:"En Ti me refugio, Eterno",32:"Dichoso aquel cuya transgresión es perdonada",
33:"Alegraos, justos, en el Eterno",34:"Bendeciré al Eterno en todo momento",
35:"Lucha, Eterno, contra quienes me atacan",36:"La transgresión habla al malvado",
37:"No te irrites a causa de los malvados",38:"Eterno, no me reproches en Tu ira",
39:"Dije: guardaré mis caminos",40:"Esperé con esperanza en el Eterno",
41:"Dichoso el que considera al débil",42:"Como cierva que busca corrientes de agua",
43:"Hazme justicia, Dios",44:"Dios, con nuestros oídos hemos escuchado",
45:"Me desborda el corazón de buenas palabras",46:"Dios es nuestro refugio y fortaleza",
47:"Aplaudan, pueblos, con las manos",48:"Grande es el Eterno y muy alabado",
49:"Escuchad esto, todos los pueblos",50:"El Dios de dioses, el Eterno, habló",
51:"Ten piedad de mí, Dios",52:"¿Por qué te jactas del mal?",
53:"Dice el necio en su corazón",54:"Dios, sálvame por Tu Nombre",
55:"Escucha, Dios, mi oración",56:"Ten piedad de mí, Dios",
57:"Ten piedad de mí, Dios",58:"¿Es que en verdad habláis justicia?",
59:"Líbrame de mis enemigos",60:"Dios, nos has rechazado",
61:"Escucha, Dios, mi clamor",62:"Solo en Dios reposa mi alma",
63:"Dios, Tú eres mi Dios",64:"Escucha, Dios, mi voz",
65:"A Ti le corresponde el silencio, Dios",66:"Aclamad a Dios, toda la tierra",
67:"Que Dios se apiade de nosotros",68:"Que se levante Dios",
69:"Sálvame, Dios",70:"Dios, para librarme",
71:"En Ti me refugio, Eterno",72:"De Shelomó",
73:"Cuán bueno es Dios para Israel",74:"¿Por qué, Dios, nos rechazas para siempre?",
75:"Te damos gracias, Dios",76:"Conocido es Dios en Yehudá",
77:"Con mi voz clamo a Dios",78:"Maskil de Asaf",
79:"Dios, las naciones invadieron Tu herencia",80:"Pastor de Israel, escucha",
81:"Cantad con alegría a Dios",82:"Dios está presente en la asamblea divina",
83:"Dios, no guardes silencio",84:"¡Cuán amadas son Tus moradas!",
85:"Te has complacido, Eterno, con Tu tierra",86:"Inclina Tu oído, Eterno",
87:"Su fundamento está en los montes sagrados",88:"Eterno, Dios de mi salvación",
89:"Maskil de Etán el Ezrajita",90:"Oración de Moshé",
91:"El que habita al amparo del Altísimo",92:"Salmo, canto para el día de Shabat",
93:"El Eterno reina",94:"Dios de venganzas",95:"Venid, cantemos al Eterno",
96:"Cantad al Eterno un canto nuevo",97:"El Eterno reina, que se alegre la tierra",
98:"Cantad al Eterno un canto nuevo",99:"El Eterno reina, tiemblan los pueblos",
100:"Aclamad al Eterno, toda la tierra",101:"Misericordia y justicia cantaré",
102:"Oración del afligido",103:"Bendice, alma mía, al Eterno",
104:"Bendice, alma mía, al Eterno",105:"Dad gracias al Eterno",
106:"Aleluya, dad gracias al Eterno",107:"Dad gracias al Eterno",
108:"Canto, salmo de David",109:"Dios de mi alabanza",
110:"Palabra del Eterno a mi señor",111:"Aleluya",
112:"Aleluya, dichoso el hombre",113:"Aleluya, alabad siervos del Eterno",
114:"Cuando Israel salió de Egipto",115:"No a nosotros, Eterno",
116:"Amo al Eterno",117:"Alabad al Eterno, naciones todas",
118:"Dad gracias al Eterno",119:"Dichosos los de camino íntegro",
120:"Canto de las Ascensiones",121:"Elevo mis ojos a los montes",
122:"Me alegré cuando me dijeron",123:"A Ti elevo mis ojos",
124:"Si no hubiera sido el Eterno",125:"Los que confían en el Eterno",
126:"Canto de las Ascensiones",127:"Canto de las Ascensiones, de Shelomó",
128:"Dichoso todo el que teme al Eterno",129:"Mucho me han angustiado desde mi juventud",
130:"Desde las profundidades te clamo",131:"Eterno, no se enalteció mi corazón",
132:"Recuerda, Eterno, a David",133:"¡Cuán bueno y cuán placentero!",
134:"Ved, bendecid al Eterno",135:"Aleluya, alabad el Nombre del Eterno",
136:"Dad gracias al Eterno",137:"Junto a los ríos de Babilonia",
138:"Te alabaré con todo mi corazón",139:"Eterno, me has escudriñado",
140:"Líbrame, Eterno, del hombre malo",141:"Eterno, a Ti clamo",
142:"Maskil de David",143:"Eterno, escucha mi oración",
144:"Bendito sea el Eterno, mi Roca",145:"Alabanza de David",
146:"Aleluya",147:"Aleluya, cuán bueno es cantar",
148:"Aleluya, alabad al Eterno desde los cielos",149:"Aleluya, cantad al Eterno",
150:"Aleluya, alabad a Dios en Su santuario"
}

DIR = "data/tehilim"
for fname in sorted(os.listdir(DIR)):
    if not fname.endswith('.json'): continue
    path = os.path.join(DIR, fname)
    with open(path, encoding='utf-8') as f:
        data = json.load(f)
    num = data['number']
    data['title_es'] = TITLES_ES.get(num, f"Salmo {num}")
    with open(path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ {num:3d}: {data['title_es']}")

print("=== HECHO ===")
