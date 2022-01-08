import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import api from './services/api';
import './styles/global.css'
import './styles/pages/home.css'
interface DDD {
  id: string,
  code: string
}

interface Cover {
  id: string,
  from: string,
  to: string,
  charge: number
}
interface Price {
  from: string,
  to: string,
  duration: string,
  plan: string,
  chargeWithPlan: string,
  chargeWithoutPlan: string
}
interface Plan {
  id: string,
  name: string,
  free_time_limit: number
}

function App() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [duration, setDuration] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const [plans, setPlans] = useState<Plan[]>([]);

  const [plan, setPlan] = useState('');

  const [cover, setCover] = useState<Cover[]>([]);



  const [price, setPrice] = useState<Price[]>([]);


  useEffect(() => {
    api.get('price').then(response => {
      setCover(response.data);
    });
    api.get('plan').then(response => {

      setPlans(response.data);
      setSelectedOption(response.data[0].id)
      setSelectedName(response.data[0].name)

    })
  }, []);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const response = await api.post('/calculate/charge', {
      from: from,
      to: to,
      duration: duration,
      plan: selectedOption
    }).then(response => {
      const newPrices = [...price, response.data]
      setPrice(newPrices);
    }
    ).catch(error => {
      alert(error.response.data.message)
      // const newPrices = [...price, response.data]
      const errorPrice: Price = {
        from: from,
        to: to,
        duration: duration,
        plan: selectedName,
        chargeWithoutPlan: '-',
        chargeWithPlan: '-'
      }
      const newPrices = [...price, errorPrice]

      setPrice(newPrices)
      return Promise.reject(error)
    }
    );
  }

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    setSelectedOption(event.target.value)
    setSelectedName(event.target.selectedOptions[0].label)
  }


  return (
    <div id="page-home">
      <div className="content-wrapper">
        <main>
          <h1>Tellzir</h1>
          <p>Fale Mais!</p>
        </main>

        <div className="prices" style={{ display: price.length > 0 ? 'block' : 'none' }} >
          <table>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Destino</th>
                <th>Duração</th>
                <th>Plano FalaMais</th>
                <th>Com FalaMais</th>
                <th>Sem FalaMais</th>
              </tr>
            </thead>
            <tbody>
              {
                price.map(row => {
                  return (
                    <tr>
                      <td>{row.from}</td>
                      <td>{row.to}</td>
                      <td>{row.duration}</td>
                      <td>{row.plan}</td>
                      {row.chargeWithPlan != '-' ?
                        <td>${Number(row.chargeWithPlan).toFixed(2)}</td> :
                        <td>{row.chargeWithPlan}</td>
                      }
                      {row.chargeWithoutPlan != '-' ?
                        <td>${Number(row.chargeWithoutPlan).toFixed(2)}</td> :
                        <td>{row.chargeWithoutPlan}</td>
                      }
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <div className="prices" style={{ marginTop: '20px', display: price.length <= 0 ? 'block' : 'none' }} >
          <h1> Insira valores para calcular a estimativa de custo! </h1>
        </div>
        <form onSubmit={handleSubmit} className="verify-price-form">
          <fieldset>
            <legend>Dados</legend>

            <div className="input-block">
              <label htmlFor="from">Origem</label>
              <input required
                id="from"
                value={from}
                onChange={event => setFrom(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="to">Destino</label>
              <input required
                id="to"
                value={to}
                onChange={event => setTo(event.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="duration">Duração (Minutos)</label>
              <input required
                id="duration"
                value={duration}
                type="number"
                onChange={event => setDuration(event.target.value)}
              />
            </div>

            <div className="input-block input-select">
              <label htmlFor="plan">Plano</label>
              {/* <Select className="select-plan" options={plans} onChange={setToppings} /> */}
              <select className="select-plan" onChange={event => { handleChange(event) }}>
                {
                  plans.map(plan => {
                    return (
                      <option value={plan.id}>{plan.name}</option>
                    );
                  })
                }
              </select>

            </div>


          </fieldset>
          <div className="button-wrapper">
            <button className="confirm-button" type="submit">
              Calcular custo
            </button>
          </div>
        </form >

        <div className="prices">
          <table>
            <caption>Tarifas</caption>
            <thead>
              <tr>
                <th>Origem</th>
                <th>Destino</th>
                <th>Valor/Minuto</th>
              </tr>
            </thead>
            <tbody>
              {
                cover.map(row => {
                  return (
                    <tr>
                      <td>{row.from}</td>
                      <td>{row.to}</td>
                      <td>R$ {row.charge.toFixed(2)}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>

        <div className="prices" style={{ marginTop: "40px" }}>
          <table>
            <caption>Planos Disponíveis</caption>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Franquia</th>
              </tr>
            </thead>
            <tbody>
              {
                plans.map(row => {
                  return (
                    <tr>
                      <td>{row.name}</td>
                      <td>{row.free_time_limit} minutos</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>

        <a href="" className="enter-crud">Link</a>
      </div >
    </div >
  );
}

export default App;
