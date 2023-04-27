# Notes

## Pobieranie danych — podczas montowania komponentu

1. Trzeba mieć dostęp do API (np. json-server)
2. Stworzyć funkcję pobierającą dane (fetch/axios)
3. Stworzyć stan do którego zapiszemy te dane
4. Należy wywołać funkcje w momencie kiedy komponent jest dodany do HTML (componentDidMount, useEffect)

```javascript

// AD.2 funkcja do pobierania danych z określonego adresu URL, async zawsze zwraca Promise,
// więc musimy go obsłużyć jak promise czyli then/catch bądź await w async function
async function getDataAPI() {
    const response = await fetch('http://localhost:3000/tasks');
    return response.json()
}

// AD.3 Aby stworzyć stan komponentu funkcyjnego należy użyć useState lub useReducer, oba trzeba importować
// useState przyjmuje initial state, czyli wartość początkową, jeżeli to input to najczęściej pusty string,
// jeżeli to wiele danych to prawdopodobnie będzie to pusta tablica. useState zwraca tablice 2 elementową,
// dlatego ją destrukturyzyjemy, pierwszy element to zmienna reprezentująca stan, a druga to funkcja
// która modyfikuje zmienną reprezentująca stan.
import {useState} from 'react';
const [task, setTask] = useState([]);

// AD.4 Aby wykonać funkcję podczas montowania komponentu, można użyć useEffect z drugim, który musi być
// tablicą, natomiast jeżeli to ma się wykonać raz, to tablica musi być pusta
// - brak drugiego parametru, lub falsy value -> wykonuje przy każdym rerenderze komponentu
// - pusta tablica -> wykonuje po dodaniu komponentu do html
// - tablica z zależnościami (zmiennymi) -> wykonuje na początku i przy każdej zmianie wartości z tablicy
// wewnątrz callback do useEffect mamy wywołanie funkcji, która pobiera dane, w związku z tym, że jest
// asynchroniczna (Promise based) to obsługujemy ją przez then/catch
import {useEffect} from 'react';
useEffect(() => {
    getDataAPI()
        .then((data) => setTask(data))
        .catch(console.error)
}, [])

```

## Dodawanie danych do aplikacji przez użytkownika

1. UI, user interface, najlepiej używać znacznik form

```jsx

<form>
    <div>
        <label htmlFor="title">Title</label>
        <input type="text" id="title" name="title"/>
    </div>
    <div>
        <label htmlFor="desc">Description</label>
        <textarea id="desc" name="desc"/>
    </div>
    <button>Add</button>
</form>


```

2. Obsługa formularzy/inputów może być zrobiona na 3 podstawowe sposoby:
   - controlled inputs (potrzebny stan i funkcja, która po wyemitowaniu zdarzenia go aktualizuje)
   - uncontrolled inputs (obsługujemy dane dopiero jak użytkownik chce je wysłać)
   - biblioteki -> Formik + Yup do walidacji

3. Wysłać dane na serwer, po odpowiedzi serwera aktualizuje stan


## Wyświetlanie danych w JSX

```jsx

// tablica -> const tasks = [{a: 1, b: 2}, {a: 23, b: 32}]

// do wyświetlenia danych prawdopodobnie ze state (useState, this.state) używa się map metody tablicy. Ona przyjmuje funkcje
// dla każdego elementu tablicy ją wykonuje, i to co zwróci będzie elementem, który się wyświetli, więc zazwyczaj zwraca JSX
// należy pamiętać o props key, gdyż react używa go do wyliczania różnicy, którą musi zaaplikować pomiędzy virtual dom i real dom
// key musi być unikalne i nie zmienialne, ale może być dowolnym prostym typem danych.
{tasks.map((task) => (
    <p key={task.a}>{task.b}</p>
))}
```


## Pobieranie i scalanie danych z różnych endpointów

```javascript

useEffect(() => {
    // metoda statyczna Promise.all() przyjmuje tablice Promises, następnie obsługuje je jednocześnie, czekając, aż ostatni się skończy,
   // metoda all zwraca Promise, więc trzeba ją obsłużyć w adekwatny sposób: await lub then
   const data = Promise.all([getDataAPI('tasks'), getDataAPI('operations')])

   data
           .then((results) => {
               // ta funkcja wykonuje się, kiedy wszystkie promisy zostały skończone, result posiada w sobie tablicę, w której są wyniki wszystkich
              // promisów z promise.all, w tej samej kolejności jak zostały podane, dlatego poniżej można użyć array destructring
              const [taskData, operationData] = results;
              
              // Aby połączyć 2 tablice z danymi, można przemapować jedną z nich, dodająć elementy drugiej do elementów pierwszej
              const tasks = taskData.map((task) => ({
                 // dla każdego elementu tablicy taskData, tworze nowy obiekt, gdzie za pomocą spread operator wstawiam wszystkie elementy
                 ...task,
                 // dokładam do nowego obiektu klucz operations, a jego wartość wyliczam przez przefiltrowanie wyników z drugiej tablicy
                 operations: operationData.filter((operation) => operation.taskId === task.id)
              }))

              // aktualizuje stan tasks
              setTasks(tasks);
           })
           .catch(console.error)

}, [])

```













