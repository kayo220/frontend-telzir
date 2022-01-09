import React, { ChangeEvent, FormEvent, useState, useEffect } from 'react';
import api from './services/api';
import './styles/global.css'
import './styles/pages/home.css'
interface DDD {
  id: string,
  code: string
}

interface Cover {
  id?: string,
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
  const [planName, setPlanName] = useState('');
  const [planTimeLimit, setPlanTimeLimit] = useState('');

  const [fromTarifa, setFromTarifa] = useState('');
  const [toTarifa, setToTarifa] = useState('');
  const [cost, setCost] = useState('');
  const [ddd, setDDD] = useState('');

  const [duration, setDuration] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedName, setSelectedName] = useState('');

  const [plans, setPlans] = useState<Plan[]>([]);
  const [ddds, setDdds] = useState<DDD[]>([]);



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
    api.get('ddd').then(response => {

      setDdds(response.data);

    })
  }, []);

  async function handleSubmitCost(event: FormEvent) {
    event.preventDefault();
    await api.post('/calculate/charge', {
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

  async function handleSubmitTarifa(event: FormEvent) {
    event.preventDefault();
    await api.post('/create/price', {
      from: { code: fromTarifa },
      to: { code: toTarifa },
      charge: cost,
    }).then(response => {
      response.data.charge = Number(response.data.charge);
      const covers = [...cover, response.data]
      setCover(covers);
    }
    ).catch(error => {
      alert(error.response.data.message)
      return Promise.reject(error)
    }
    );
  }

  async function handleSubmitPlan(event: FormEvent) {
    event.preventDefault();
    await api.post('/create/plan', {
      name: planName,
      free_time_limit: planTimeLimit
    }).then(response => {
      const newPlans = [...plans, response.data]
      setPlans(newPlans);
    }
    ).catch(error => {
      alert(error.response.data.message)
      return Promise.reject(error)
    }
    );
  }

  async function handleSubmitDDD(event: FormEvent) {
    event.preventDefault();
    await api.post('/create/ddd', {
      code: ddd,
    }).then(response => {
      const newDDDs = [...ddds, response.data]
      setDdds(newDDDs);
    }
    ).catch(error => {
      alert(error.response.data.message)
      return Promise.reject(error)
    }
    );
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
                      {row.chargeWithPlan !== '-' ?
                        <td>${Number(row.chargeWithPlan).toFixed(2)}</td> :
                        <td>{row.chargeWithPlan}</td>
                      }
                      {row.chargeWithoutPlan !== '-' ?
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
        <form onSubmit={handleSubmitCost} className="verify-price-form">
          <fieldset>
            <legend>Dados para cálculo de custo usando um de nossos planos!</legend>

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
                      <option key={plan.id} value={plan.id}>{plan.name}</option>
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


        <div className="prices" >
          <table>
            <caption>DDDs cadastrados</caption>
            <thead>
              <tr>
                <th>Código</th>
              </tr>
            </thead>
            <tbody>
              {
                ddds.map(row => {
                  return (
                    <tr>
                      <td>{row.code}</td>
                    </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>

        <form onSubmit={handleSubmitDDD} className="verify-price-form">
          <fieldset>
            <legend>Formulário para inserção de DDD!</legend>
            <div id="ddd-form">
              <div className="input-block" >
                <label htmlFor="from">Código</label>
                <input required
                  type="number"
                  id="ddd"
                  value={ddd}
                  onChange={event => setDDD(event.target.value)}
                />
              </div>
            </div>
          </fieldset>
          <div className="button-wrapper">
            <button className="confirm-button" type="submit">
              Inserir DDD
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

        <form onSubmit={handleSubmitTarifa} className="verify-price-form">
          <fieldset>
            <legend>Formulário para inserção de tarifas!</legend>

            <div className="input-block">
              <label htmlFor="from">Origem</label>
              <input required
                id="fromTarifa"
                value={fromTarifa}
                onChange={event => setFromTarifa(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="to">Destino</label>
              <input required
                id="toTarifa"
                value={toTarifa}
                onChange={event => setToTarifa(event.target.value)}
              />
            </div>
            <div className="input-block">
              <label htmlFor="cost">Custo por minuto (ex. 8.5)</label>
              <input required
                id="cost"
                value={cost}
                type="number"
                onChange={event => setCost(event.target.value)}
              />
            </div>

          </fieldset>
          <div className="button-wrapper">
            <button className="confirm-button" type="submit">
              Inserir tarifa
            </button>
          </div>
        </form >

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

        <form onSubmit={handleSubmitPlan} className="verify-price-form">
          <fieldset>
            <legend>Formulário para inserção de planos!</legend>

            <div className="input-block">
              <label htmlFor="from">Nome do plano</label>
              <input required
                id="planName"
                value={planName}
                onChange={event => setPlanName(event.target.value)}
              />
            </div>

            <div className="input-block">
              <label htmlFor="planTimeLimit">Tempo de Franquia (minutos)</label>
              <input required
                type="number"
                id="planTimeLimit"
                value={planTimeLimit}
                onChange={event => setPlanTimeLimit(event.target.value)}
              />
            </div>
          </fieldset>
          <div className="button-wrapper">
            <button className="confirm-button" type="submit">
              Inserir Plano
            </button>
          </div>
        </form >
      </div >
    </div >
  );
}

export default App;
