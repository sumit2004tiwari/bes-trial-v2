import styles from "@/app/about_bes/content.module.css";
export default function page() {
  return (
    <div
      className={"flex flex-col max-w-[800px] p-4 " + styles.content_container}
      style={{ margin: "0 auto" }}
    >
      <h2 className="text-[26px] font-bold">Useful Links</h2>

      <div>
        <p>
        <strong>WAVES</strong>
          <br />{" "}
          <a href="https://wavesindia.org" target="_blank" rel="noopener noreferrer">
          wavesindia.org
          </a>
          <br />
          <strong> Ministry of Information & Broadcasting</strong>
          <br />{" "}
          <a href="https://mib.nic.in" target="_blank" rel="noopener noreferrer">
            mib.nic.in
          </a>
          <br />
          <strong>Prasar Bharati</strong>
          <br />
          <a href="https://prasarbharati.gov.in" target="_blank" rel="noopener noreferrer">
            prasarbharati.gov.in
          </a>
          <br />
          <strong> All India Radio</strong>
          <br />{" "}
          <a href="https://allindiaradio.gov.in" target="_blank" rel="noopener noreferrer">
            allindiaradio.gov.in
          </a>
          <br />
          <strong> Doordarshan</strong>
          <br />
          <a href="https://www.ddindia.gov.in" target="_blank" rel="noopener noreferrer">
            www.ddindia.gov.in
          </a>
                 
          
          <br /> <strong>Asia-Pacific Broadcasting Union (ABU)</strong>
          <br />
          <a href="https://www.abu.org.my" target="_blank" rel="noopener noreferrer">
            {" "}
            www.abu.org.my
          </a>
          <br />
          <strong>
            International Association of Broadcasting Manufacturers (IABM)
          </strong>
          <br />
          <a href="https://www.theiabm.org">www.theiabm.org</a>
          <br /> <strong>Society of Broadcast Engineers</strong>
          <br />
          <a href="https://www.sbe.org">www.sbe.org</a>
        </p>
      </div>
    </div>
  );
}
