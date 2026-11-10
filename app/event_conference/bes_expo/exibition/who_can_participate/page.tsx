import styles from "@/app/about_bes/content.module.css";
import BesExpo2025 from "./components/participation";
export default function page() {
  return (
    <div
      className={
        "flex flex-col  m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Who can participate? </h2>

      <div>
        <p>
          <strong> BES EXPO 2027</strong> is open for participation by
          manufacturers, dealers, and distributors of products and services
          related to radio and television broadcasting from India and abroad.
        </p>
        <p>Exhibiting offers a setting to demonstrate your technology, discuss technical requirements with broadcast professionals, and introduce your team to potential customers and collaborators. Consult the products on display section to understand the range of equipment and services covered by the exhibition.</p>
        <p>Before booking, review the participation fees, exhibition floor plan, and guidelines. For questions about available space or the arrangements for your organisation, contact the exhibition team using the details on the contact page.</p>
      </div>
      <BesExpo2025 />  
    </div>
  );
}
