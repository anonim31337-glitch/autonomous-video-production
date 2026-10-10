/**
 * Rozdział 2: wrzesień, GPT-6 Astra kontra Opus 5.5. Lektor: N2 (Scrimba <EXPLAINER_ID>). Liczby z v1 E2.
 */
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {C} from '../brand';
import {Big, Pill} from '../components';
import {At} from '../cues';
import {Bars, Beats, By, ChapterCard, Flow, Head, Points, Versus, WallTopic} from '../kit';

export const Ch2: React.FC<{at: At; end: number}> = ({at, end}) => {
  const beats = [
    {from: 0, el: <ChapterCard num={2} title="Wrzesień: Astra kontra Opus 5.5" sub="dwa modele i jedna dziwna liczba" from={0} />},
    {from: at('Na początku września'), el: (
      <>
        <Head tag="Wrzesień" title="Fable 5.1, a dwa dni później GPT-6 Astra" from={at('Na początku września')} />
        <WallTopic topic="astra" at={at('pokazało')} title="mówiło o GPT-6 Astra" top={290} />
      </>)},
    {from: at('Film Net Gonetu'), el: (
      <AbsoluteFill style={{justifyContent: 'center', paddingLeft: 150}}>
        <Big value="≈ 180 tys. wyświetleń" label="test Astry od NetGonetu — najwięcej ze wszystkich filmów o AI w próbie" from={at('Film Net Gonetu')} size={120} color={C.orange} />
      </AbsoluteFill>)},
    {from: at('zwrócił uwagę na najważniejszą'), el: (
      <>
        <Head tag="Co obiecała Astra" title="Model, który pracuje na komputerze" from={at('zwrócił uwagę na najważniejszą')} />
        <Flow top={330} steps={[
          {text: 'Otwiera strony', at: at('otwierać strony')},
          {text: 'Klika przyciski', at: at('klikać przyciski')},
          {text: 'Wypełnia formularze', at: at('wypełniać formularze')},
          {text: 'Prowadzi własne notatki między oknami kontekstu', at: at('własne notatki'), color: C.yellow},
        ]} note={{text: 'Cena: 10 $ / 50 $ za milion tokenów — tyle co Fable, ale mniej tokenów na zadanie (Mikołaj Abramczuk)', at: at('podał cenę')}} />
        <By ch="Webflip AI" text="opis najważniejszej zmiany" at={at('zwrócił uwagę na najważniejszą', 0.5)} />
      </>)},
    {from: at('Tabela pokazuje liczby'), el: (
      <>
        <Head tag="Dane OpenAI z premiery" title="Gdzie Astra wyprzedza konkurencję" from={at('Tabela pokazuje liczby')} />
        <Bars from={at('W pracy w terminalu')} max={60} top={270} w={900} source="Terminal Bench 4 i Automation Bench, w punktach · cytował Webflip AI" rows={[
          {label: 'Astra · terminal', value: 57.9, text: '57,9', at: at('W pracy w terminalu')},
          {label: 'Fable 5.1 · terminal', value: 55.8, text: '55,8', color: C.muted, note: '−2 pkt', at: at('o dwa punkty')},
          {label: 'Astra · biuro', value: 41.4, text: '41,4', at: at('w automatyzowaniu procesów')},
          {label: 'Fable 5.1 · biuro', value: 31.4, text: '31,4', color: C.muted, note: '−10 pkt', at: at('już o dziesięć')},
        ]} />
      </>)},
    {from: at('Najciekawszy jest ostatni'), el: (
      <>
        <Head tag="Najciekawszy wiersz" title="Wychodzenie poza zakres zadania" from={at('Najciekawszy jest ostatni')} />
        <Bars from={at('poprzedni Sol')} max={50} top={330} lowerBetter="mniej = lepiej" source="według testów OpenAI" rows={[
          {label: 'GPT 5.6 Sol', value: 48, text: '48%', color: C.red, at: at('w czterdziestu ośmiu')},
          {label: 'GPT-6 Astra', value: 0, text: '0%', color: C.green, note: 'ani razu', at: at('a Astra ani razu')},
        ]} />
      </>)},
    {from: at('Najgłośniejsza liczba września'), el: (
      <>
        <Head tag="ARC-AGI-3" title="Gra, której model nigdy nie widział" from={at('Najgłośniejsza liczba września')} />
        <Bars from={at('dziewięćdziesiąt dziewięć')} max={100} top={300} source="ARC-AGI-3 · NetGonet i Webflip AI dodali gwiazdkę" rows={[
          {label: 'Astra z nakładką OpenAI', value: 99.9, text: '99,9%*', at: at('dziewięćdziesiąt dziewięć')},
          {label: 'Astra bez nakładki', value: 63, text: '≈ 63%', color: C.yellow, note: 'niezależna powtórka', at: at('Niezależna powtórka')},
          {label: 'Opus 5', value: 30, text: '≈ 30%', color: C.muted, at: at('Opus 5 miał tam')},
        ]} />
        <div style={{position: 'absolute', left: 580, top: 690}}>
          <Pill text="* z własnym rusztowaniem OpenAI" from={at('z własnym rusztowaniem')} color={C.orange} />
        </div>
      </>)},
    {from: at('Premierze towarzyszyły'), el: (
      <>
        <Head tag="Hasła kontra praktyka" title="Fachowiec za dwóch, ale rzadko" from={at('Premierze towarzyszyły')} />
        <By ch="Aleks Szach" text="cytował Altmana o „wchodzeniu w erę AGI”" at={at('Szach cytował')} top={290} />
        <Bars from={at('W jego teście')} max={66} top={400} w={880} lowerBetter="mniej = lepiej" source="czas dużego zadania · test AI bez jaj" rows={[
          {label: 'Astra (niskie rozumowanie)', value: 39, text: '39 min', color: C.green, at: at('trzydzieści dziewięć minut')},
          {label: 'stary Sol', value: 66, text: '66 min', color: C.muted, at: at('sześćdziesięciu sześciu')},
        ]} />
        <By ch="AI bez jaj" text="„może przyjść tylko dwa, trzy razy w tygodniu, bo limity kończą się szybko”" at={at('porównał ją do fachowca')} top={830} />
      </>)},
    {from: at('Najwięcej wartości miały'), el: (
      <>
        <Head tag="Prawdziwe projekty" title="Lokomotywa ze zdjęcia w 43 minuty" from={at('Najwięcej wartości miały')} />
        <Versus from={at('zamienił zdjęcie lokomotywy')} top={300} items={[
          {name: 'W abonamencie', lines: [{k: 'animowany model 3D ze zdjęcia', v: '≈ 6 zł', at: at('w abonamencie wyszło'), good: true}]},
          {name: 'Przez API', lines: [{k: 'to samo zadanie', v: '≈ 65 zł', at: at('około sześćdziesiąt pięć'), good: false}]},
        ]} />
        <By ch="NetGonet" text="zamienił zdjęcie lokomotywy w animowany model 3D" at={at('zamienił zdjęcie lokomotywy')} />
      </>)},
    {from: at('Aleks Szach pokazał, że Astra'), el: (
      <>
        <Head tag="Co jeszcze zbudowali" title="Astra w pracy twórców" from={at('Aleks Szach pokazał, że Astra')} />
        <Points top={300} items={[
          {text: 'Animacja w After Effects warstwa po warstwie', sub: 'Aleks Szach: da się ją potem ręcznie poprawić', at: at('Aleks Szach pokazał, że Astra')},
          {text: 'Teledysk z tekstu i muzyki', sub: 'Webflip AI: model sam wymyślił i wyrenderował', at: at('dał jej tekst i muzykę')},
          {text: 'Cały montaż odcinka w Codexie', sub: 'Webflip AI: cięcie pomyłek, dźwięk, korekcja kolorów', at: at('Ten sam kanał oddał')},
        ]} />
      </>)},
    {from: at('Za moc Astry'), el: (
      <>
        <Head tag="Limity" title="Za moc Astry płaciło się limitem" from={at('Za moc Astry')} />
        <Bars from={at('U Aleksa Szacha')} max={100} top={300} w={880} source="tygodniowy limit · test Aleksa Szacha (plan za 400 zł)" rows={[
          {label: 'Jedna strona internetowa', value: 20, text: '20% tygodnia', color: C.red, at: at('zjadła dwadzieścia procent')},
        ]} />
        <Points top={520} numbered={false} items={[
          {text: 'Rada: rozpoznanie projektu zlecaj tańszej Lunie', sub: 'Robert Szewczyk: Astrę zostaw do najtrudniejszych kroków', at: at('Robert Szewczyk radził')},
        ]} />
        <By ch="Webflip AI" text="pierwszy model OpenAI, który tak szybko zjada limity w ChatGPT i Codexie" at={at('Łebflip zauważył')} />
      </>)},
    {from: at('Pod koniec września Antropik'), el: (
      <>
        <Head tag="Ten sam dzień" title="Anthropic i OpenAI: premiery tego samego dnia" from={at('Pod koniec września Antropik')} />
        <Versus from={at('wypuściły nowe modele')} top={300} h={440} items={[
          {name: 'Anthropic', lines: [{k: 'nowy model', v: 'Claude Opus 5.5', at: at('pokazał Klod Opusa')}]},
          {name: 'OpenAI', lines: [{k: 'nowe modele', v: 'GPT-6 Sol i Luna', at: at('modele dżi pi ti 6 Sol')}, {k: 'tydzień później', v: 'GPT 6.1 Sol', at: at('a tydzień później')}]},
        ]} />
        <div style={{position: 'absolute', left: 150, top: 840}}>
          <Pill text="rzadkość: oba tańsze od poprzedników (Aleks Szach)" from={at('oba nowe modele były tańsze')} color={C.green} />
        </div>
      </>)},
    {from: at('Wrześniowy cennik'), el: (
      <>
        <Head tag="Wrzesień 2026" title="Cena za milion tokenów wyjścia" from={at('Wrześniowy cennik')} />
        <Bars from={at('Wrześniowy cennik')} max={50} top={270} source="według Mikołaja Abramczuka, Aleksa Szacha i Krzysztofa Bohaczyka" rows={[
          {label: 'GPT-6 Astra', value: 50, text: '50 $', color: C.orange, at: at('Wrześniowy cennik', 0.6)},
          {label: 'Claude Opus 5.5', value: 20, text: '20 $', color: C.green, note: 'mniej niż połowa Fable', at: at('kosztuje cztery i dwadzieścia')},
          {label: 'GPT 6.1 Sol', value: 10, text: '10 $', color: C.yellow, at: at('schodzi do dwóch')},
          {label: 'Jev (TypeSafe)', value: 0, text: '0 $', color: C.muted, note: 'wejście < 0,05 $', at: at('Ostatni wiersz to model')},
        ]} />
        <By ch="Aleks Szach" text="zadanie naukowe w terminalu: nowy Sol ≈ 5,50 $, konkurencja > 23 $" at={at('w naukowych zadaniach')} />
      </>)},
    {from: at('zebrał od polskich twórców'), el: (
      <>
        <Head tag="Recenzje" title="Opus 5.5 według polskich twórców" from={at('zebrał od polskich twórców')} />
        <WallTopic topic="opus55" at={at('zebrał od polskich twórców')} title="mówiło o Opusie 5.5" top={280} />
      </>)},
    {from: at('Robert Szewczyk policzył'), el: (
      <>
        <Head tag="Zmiana stylu" title="Długie myślniki na 1000 słów" from={at('Robert Szewczyk policzył')} />
        <Bars from={at('Robert Szewczyk policzył')} max={16} top={320} lowerBetter="mniej = lepiej" source="policzył Robert Szewczyk" rows={[
          {label: 'Opus 5', value: 15.2, text: '15,2', color: C.muted, at: at('wstawiał piętnaście')},
          {label: 'Opus 5.5', value: 0.8, text: '0,8', color: C.green, note: '≈ −95%', at: at('mniej niż jeden')},
        ]} />
        <By ch="Aleks Szach" text="minus: zadania „ryzykowne” po cichu trafiają do starszego Opusa, nawet proste" at={at('Minusem są przekierowania')} />
      </>)},
    {from: at('Najgłośniejsza historia bezpieczeństwa'), el: (
      <>
        <Head tag="Bezpieczeństwo" title="Trzy osoby, < 3000 $, < 72 godziny" from={at('Najgłośniejsza historia bezpieczeństwa')} />
        <Flow top={330} steps={[
          {text: 'Tokeny za mniej niż 3000 $', at: at('mniej niż trzy tysiące')},
          {text: 'Exploit napisany przez Claude Opus 5', at: at('Exploit napisał')},
          {text: 'Włamanie do OpenAI w mniej niż 72 h', at: at('siedemdziesiąt dwie godziny'), color: C.red},
          {text: 'Luka załatana, nagroda 6500 $', at: at('załatało lukę'), color: C.green},
        ]} />
        <By ch="Aleks Szach" text="opisał całą historię" at={at('według Aleksa Szacha')} />
      </>)},
    {from: at('Najdziwniejszym debiutem'), el: (
      <>
        <Head tag="Jev od TypeSafe" title="Model, który nie pisze, tylko decyduje" from={at('Najdziwniejszym debiutem')} />
        <Versus from={at('W teście Michała Barczaka')} top={300} items={[
          {name: 'Jev', lines: [{k: 'czas tej samej oceny', v: '0,4 s', at: at('czterech dziesiątych sekundy'), good: true}, {k: '1000 życiorysów', v: '≈ 8 centów', at: at('około ośmiu centów'), good: true}]},
          {name: 'GPT Sol', lines: [{k: 'czas tej samej oceny', v: '23 s', at: at('a Solowi dwadzieścia trzy'), good: false}]},
        ]} />
        <By ch="Michał Barczak" text="test szybkości · koszt życiorysów: Krzysztof Bohaczyk · 40 mln $ i 15 IX: Aleks Szach" at={at('W teście Michała Barczaka')} />
      </>)},
    {from: at('Pod koniec września twórcy zestawili'), el: (
      <>
        <Head tag="Werdykty" title="Kto wygrał w czyich testach" from={at('Pod koniec września twórcy zestawili')} />
        <Points top={290} items={[
          {text: 'Webflip AI → Opus 5.5', sub: '5 aplikacji, od strony po kostkę Rubika', at: at('wskazali Opusa')},
          {text: 'Krzysztof Bohaczyk → Opus 5.5', sub: '≈ 2,48 $ zamiast ≈ 7 $ za Astrę', at: at('prawie trzy razy tańszego')},
          {text: 'AI bez jaj → remis', sub: 'Opus wyglądem, Sol szybkością', at: at('podzielił werdykt')},
          {text: 'Aleks Szach → każde zadanie inny model', sub: 'planer posiłków z cenami z Lidla, wideo, scena 3D', at: at('w teście planera')},
        ]} />
      </>)},
    {from: at('Wrzesień zostawił'), el: (
      <>
        <Head tag="Czego uczy wrzesień" title="Trzy praktyczne lekcje" from={at('Wrzesień zostawił')} />
        <Points top={320} items={[
          {text: 'Czytaj gwiazdki', sub: '99,9% z nakładką i 63% bez to dwie różne historie', at: at('Czytaj gwiazdki')},
          {text: 'Tańszy token to nie tańsze zadanie', sub: 'AI bez jaj po teście Sonneta 5.5', at: at('Tańszy token nie oznacza')},
          {text: 'Testuj na własnych plikach', sub: 'czterech twórców, różni zwycięzcy', at: at('testuj na własnych plikach')},
        ]} />
      </>)},
    {from: at('Same modele to jednak'), el: (
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center'}}>
        <Big value="Druga połowa: agenci" label="którzy z tych modeli korzystają" from={at('Same modele to jednak')} size={130} color={C.orange} />
      </AbsoluteFill>)},
  ];
  return <Beats beats={beats} end={end} />;
};
