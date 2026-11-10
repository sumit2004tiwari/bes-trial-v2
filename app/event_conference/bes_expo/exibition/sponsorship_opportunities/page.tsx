import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
    >
      <h2 className="text-[26px] font-bold">Sponsorship opportunities</h2>

      <div>
        <p>
          Sponsorship opportunities at the expo are generally in great demand.
          Exhibitors/Sponsorer desirous of sponsoring any 
          activities/item(s) are requested to contact Broadcast Engineering
          Society (India) immediately on bes@besindia.com.
        
        </p>

      </div>
      <a href="/pdf/others/sponsorship_opportunity.pdf" target="_blank" className='text-blue-900 hover:underline hover:border-b-0' style={{borderBottom:0}}>Download Sponsorship opportunities for BES Expo 2027</a>
    </div>
  );
}
