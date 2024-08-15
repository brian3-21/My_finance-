import { useState, useEffect } from 'react'; 
import './dashboard.css';
import FinancialChart from '../../components/FinancialChart/financial-chart-component';
import { supabase } from '../../services/supabase/create-client-supabase';
import { Money, MoneyUser } from '../../utils/interfase';



export default function Dashboard() {
  const [ userData, setUserData] = useState<MoneyUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const userId = session.user.id;

          // Obtenemos los datos del usuario desde la tabla `money`
          const { data, error } = await supabase
            .from('Money')
            .select('*')
            .eq('id', userId)
            .single();

          if (error) {
            console.error('Error fetching user data:', error);
          } else {
            setUserData(data as MoneyUser);
          }
        }
      } catch (error) {
        console.error('Error fetching session or user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>No financial data found</p>;
  }

  return (
    <>
      <div className="chart-container">
        <FinancialChart  dataChart={userData} /> {/* Pasas la data a tu componente de gráficos */}
      </div>
      <div className="user-info">
        <pre>
          {/* Puedes mostrar la información del usuario aquí */}
          {JSON.stringify(userData, null, 2)}
          {`numero: ${userData.money.long_term}`}
        </pre>
      </div>
    </>
  );
}
