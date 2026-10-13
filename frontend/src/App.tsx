import { TopBar } from "./components/layout/TopBar";
import { storedConcepts } from "./hooks/useMission";
import { useHashRoute } from "./hooks/useHashRoute";
import { useI18n } from "./i18n";
import { DigitIsland } from "./pages/DigitIsland";
import { HomePage } from "./pages/HomePage";

export default function App() {
  const { t } = useI18n();
  const [route, navigate] = useHashRoute();
  const goHome = () => navigate("home");

  return (
    <>
      <TopBar
        title={route === "digit-island" ? t.mission.title : undefined}
        onHome={goHome}
        showDepth={route === "digit-island"}
      />
      {route === "digit-island" ? (
        <DigitIsland onHome={goHome} />
      ) : (
        <HomePage
          started={storedConcepts().length > 0}
          onStart={() => navigate("digit-island")}
        />
      )}
    </>
  );
}
