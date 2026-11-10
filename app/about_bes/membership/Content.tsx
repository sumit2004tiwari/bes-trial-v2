import React from "react";
import Link from "next/link";
import { Icon } from "@/app/UIComponent/design/Icons";
import styles from "../content.module.css";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
export default function Content() {
  return (
    <div
      className={
        "flex flex-col max-w-[800px] m-auto p-4 " + styles.content_container
      }
    >
      <h2 className="text-[26px] font-bold">Membership</h2>
      <div className="membership-summary"><div className="eyebrow">Grow with the broadcast community</div><h3>Your expertise belongs here.</h3><p>Explore membership categories, eligibility, and fees below. Create your account to get started, or download the relevant membership form.</p><Link href="/member_signup" className="button button-primary">Create your member account<Icon name="arrow" /></Link></div>
      <div className="pl-4 mt-2">
        <ul className={styles["order-list"]}>
          <li>
            <h3 className="font-bold text-[18px] text-[#003366]">
              Membership classes
            </h3>
            <div className="pl-2">
              <h4 className="text-[16px] font-bold text-[#003366]">
                The Society has the following 7 classes of members:
              </h4>
              <ul className={"pl-8 " + styles["unorder-list"]}>
                <li>Life Member</li>
                <li>Life Fellow</li>
                <li>Associate Member</li>
                <li>Student Member</li>
                <li>Life Corporate Member</li>
                <li>Honorary Fellow</li>
                <li>Affiliate Member</li>
              </ul>
            </div>
          </li>
          <li className="mt-8">
            <h3 className="font-bold text-[18px] text-[#003366]">
              Qualification for membership
            </h3>
            <div className={"pl-2 mt-2 " + styles["table_border"]}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="text-[#003366] font-bold">
                      Class of Member
                    </TableCell>

                    <TableCell className="text-[#003366] font-bold">
                      Qualification
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>1</TableCell>
                    <TableCell> Life Member</TableCell>
                    <TableCell>
                      1. Either (a) be a graduate in engineering in electronics/
                      communication/ computer science/ information technology or
                      (b) be a post-graduate in science with specialization in
                      electronics/ communication or ( c) hold nationally
                      recognized equivalent qualification for (a) or (b) above
                      <br />
                      <br />
                      <strong>AND</strong> <br />
                      <br />
                      2. have a minimum of two years experience in the field of
                      broadcasting.
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2</TableCell>
                    <TableCell> Life fellow</TableCell>
                    <TableCell>
                      1. Should have attained the age of 40 years <br />
                      <br />
                      2. Either (a) have the necessary qualification for a life
                      member or (b) be already a life member of the society
                      <br />
                      <br />
                      <strong> AND</strong>
                      <br />
                      <br /> 3. have made significant contribution to the
                      Broadcast Engineering profession.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>3</TableCell>
                    <TableCell> Associate Member</TableCell>
                    <TableCell>
                      1. either (a) possess a diploma in electronics/
                      communication / computer science/ information technology
                      or (b) be a graduate in science with specialization in
                      electronics/ communication or (c) hold nationally
                      recognized equivalent qualification for (a) or (b) above{" "}
                      <br />
                      <br />
                      <strong> AND</strong>
                      <br />
                      <br /> 2. have a minimum of fifteen years of experience
                      after acquiring the qualification stated in (1) above
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4</TableCell>
                    <TableCell> Student Member</TableCell>
                    <TableCell>
                      shall be a student in a recognized institution affiliated
                      to an university and undergoing a course leading to either
                      graduation in engineering in electronics/ communication /
                      computer science/ information technology or post
                      graduation in science with specialization in electronics/
                      communication.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5</TableCell>
                    <TableCell> Life Corporate Member</TableCell>
                    <TableCell>
                      The Council, by vote, may admit any commercial
                      organization or academic institution interested in
                      promoting the objects of the Society as Life Corporate
                      Member hereinafter called Corporate Member. Corporate
                      Member shall pay one time fee of Rs. 1,00,000/- or US
                      $.2,000.
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6</TableCell>
                    <TableCell> Honorary Fellow</TableCell>
                    <TableCell>
                      Distinguished person intimately connected with broadcast
                      engineering/science or an allied subject whom the Society
                      wishes to honour
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>7</TableCell>
                    <TableCell> Affiliate Member</TableCell>
                    <TableCell>
                      A person of outstanding repute and eminence in the art &
                      science of broadcast engineering or any of its allied
                      professions can be affiliated by the Council of the
                      Society
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </li>
          <li className="mt-8">
            <h3 className="font-bold text-[18px] text-[#003366]">
              Subscription
            </h3>
            <div className={"pl-2 mt-2 " + styles["table_border"]}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="font-bold">Class of member</TableCell>
                    <TableCell className="font-bold" colSpan={2}>
                      Life subscription fee
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell className="font-bold">Indian</TableCell>
                    <TableCell className="font-bold">Overseas</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Life Fellow </TableCell>
                    <TableCell>Rs. 10,000 </TableCell>
                    <TableCell>US $1000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Life Member *</TableCell>
                    <TableCell>Rs. 5,000</TableCell>
                    <TableCell>US $500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Associate Member</TableCell>
                    <TableCell>Rs. 5,000</TableCell>
                    <TableCell>US $500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Affiliate Member</TableCell>
                    <TableCell>Rs. 5,000</TableCell>
                    <TableCell>US $500</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Student Member</TableCell>
                    <TableCell>Rs. 1000</TableCell>
                    <TableCell>US $200</TableCell>
                  </TableRow> 
                  <TableRow>
                    <TableCell>Life Corporate Member</TableCell>
                    <TableCell>Rs. 1,00,000</TableCell>
                    <TableCell>US $2,000</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Honorary Fellow</TableCell>
                    <TableCell>NIL</TableCell>
                    <TableCell>NIL</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Age above 60 yrs</TableCell>
                    <TableCell>Rs. 1100</TableCell>
                    <TableCell>US $210</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </li>
          <li className="mt-8">
            <h3 className="font-bold text-[18px] text-[#003366]">
              Rights & privileges of Members
            </h3>
            <div className={"pl-2 mt-2 " + styles["table_border"]}>
              <ul className={"pl-8 " + styles["order-list_subheading"]}>
                <li>
                  <strong className="font-bold text-[#003366]">
                    Life Members & Life Fellows
                  </strong>{" "}
                  are entitled to participate in all the activities of the
                  Society. They have right to vote and will receive journals
                  free of charge. They are also entitled to serve in the
                  council.
                </li>
                <li>
                  <strong className="font-bold text-[#003366]">
                    Associate Member, Student Member, Life Corporate Member,
                    Honorary Fellow and Affiliate Member
                  </strong>{" "}
                  are also entitled to participate in all activities of the
                  Society and will receive technical journal free of charge. But
                  they neither have power to vote in the meetings of the Society
                  nor to hold any office of the Society.
                </li>
                <li>
                  The rights & privileges of the members are not transferable.
                </li>
                <li>
                  Some of the information available at this website is
                  accessible to BES (I) members only.
                </li>
              </ul>
            </div>
          </li>
          <li className="mt-8">
            <h3 className="font-bold text-[18px] text-[#003366]">
              How to become a Member of BES (I)?
            </h3>
            <div className={"pl-2 mt-2 " + styles["table_border"]}>
              <h4 className="font-bold">
                Any person fulfilling the requisite qualification can apply for
                the membership by filling the membership form.
              </h4>
              <ul className={"pl-8 " + styles["order-list_subheading"]}>
                <li>The form can be downloaded from this website</li>
                <li>
                  You can take the print of the form, fill it up and send by
                  post alongwith the subscription fee. The copies of the
                  relevant documents and photographs are to be sent at the
                  following address:
                </li>
              </ul>
              <p>
                The Hon. Secretary General
                <br />
                Broadcast Engineering Society (India)
                <br />
                912, Surya Kiran Building
                <br />
                19, Kasturba Gandhi Marg
                <br />
                New Delhi-110001
                <br />
                Tel: + 91 11 23316709
               
                <br />
                Email: <a href="mailto:bes@besindia.com">bes@besindia.com</a>
                <br />
                <a
                  className="text-[#0000EE] underline cursor-pointer hover:border-0"
                  style={{ borderBottom: 0 }}
                  href="/pdf/membership/aem.pdf"
                  target="_blank"
                >
                  Download
                </a>{" "}
                Membership form for LM/LF/AM/SM/AM <br />
                <a
                  className="text-[#0000EE] underline cursor-pointer hover:border-0"
                  style={{ borderBottom: 0 }}
                  href="/pdf/membership/corporatemembershipform11.pdf"
                  target="_blank"
                >
                  Download
                </a>{" "}
                Membership Form for Life Corporate Member
                <br />
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
