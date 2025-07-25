"use client";

import { FunctionComponent, useEffect, useState } from "react";
import styles from "./PeriodTable.module.scss";
import { PeriodDTO } from "@/api/DTO/PeriodDTO";
import SearchInput from "@/components/Generic/Table/SearchInput/SearchInput";
import Pagination from "@/components/Generic/Table/Pagination/Pagination";
import Button from "@/components/Generic/Button/Button";
import Modal from "@/components/Generic/Modal/Modal";
import PeriodForm from "@/components/Forms/PeriodForm/PeriodForm";
import { ButtonType } from "@/util/enums/ButtonType";
import { PeriodApi } from "@/api/interfaces/period";
import YesNoPrompt from "@/components/Generic/YesNoPrompt/YesNoPrompt";
import { PeriodTableDTO } from "@/api/DTO";
import TableConstants, {
  TableSortDirection,
} from "@/util/constants/TableConstants";
import TableHeader from "@/components/Generic/Table/TableHeader/TableHeader";
import { PeriodTableHeadersSort } from "@/util/constants/PeriodConstant";

interface IProps {
  initialPeriodTableDTO: PeriodTableDTO;
}

const PeriodTable: FunctionComponent<IProps> = ({ initialPeriodTableDTO }) => {
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState<boolean>(false);
  const [isYesNoModalOpen, setIsYesNoModalOpen] = useState<boolean>(false);
  const [periods, setPeriods] = useState<PeriodDTO[]>(
    initialPeriodTableDTO.periods || []
  );
  const [selectedPeriod, setSelectedPeriod] = useState<PeriodDTO | undefined>(
    undefined
  );
  const [periodIdToDelete, setPeriodIdToDelete] = useState<string | undefined>(
    undefined
  );
  const [pageIndex, setPageIndex] = useState<number>(1);
  const [pageSize] = useState<number>(TableConstants.defaultPageSize);
  const [totalCount, setTotalCount] = useState<number>(
    initialPeriodTableDTO.totalCount
  );
  const [searchString, setSearchString] = useState<string>("");
  const [sortColumn, setSortColumn] = useState<PeriodTableHeadersSort>(
    PeriodTableHeadersSort.TITLE
  );
  const [sortDirection, setSortDirection] = useState<TableSortDirection>(
    TableSortDirection.ASC
  );

  useEffect(() => {
    fetchPeriods();
  }, [pageIndex, pageSize, searchString, sortColumn, sortDirection]);

  const fetchPeriods = async () => {
    const periodTableDTO: PeriodTableDTO = await PeriodApi.GetPeriods(
      pageIndex,
      pageSize,
      searchString,
      sortColumn,
      sortDirection
    );
    setTotalCount(periodTableDTO.totalCount);
    setPeriods(periodTableDTO.periods);
  };

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection((prev) =>
        prev === TableSortDirection.ASC
          ? TableSortDirection.DESC
          : TableSortDirection.ASC
      );
    } else {
      setSortColumn(column as PeriodTableHeadersSort);
      setSortDirection(TableSortDirection.ASC);
    }
  };

  const searchFunctionCallback = async (newSearchString: string) => {
    if (newSearchString !== searchString) {
      setSearchString(newSearchString);
      setPageIndex(1);
    }
  };

  const paginationFunctionCallback = async (pageIndex: number) => {
    setPageIndex(pageIndex);
  };

  const togglePeriodModal = () => {
    setIsPeriodModalOpen(!isPeriodModalOpen);
  };

  const toggleYesNoModal = () => {
    setIsYesNoModalOpen(!isYesNoModalOpen);
  };

  const createButtonClicked = () => {
    setSelectedPeriod(undefined);
    togglePeriodModal();
  };

  const editButtonClicked = (period: PeriodDTO) => {
    setSelectedPeriod(period);
    togglePeriodModal();
  };

  const deleteButtonClicked = (periodId: string) => {
    setPeriodIdToDelete(periodId);
    setIsYesNoModalOpen(true);
  };

  const yesNoPromptAnswer = async (decision: boolean) => {
    if (decision && periodIdToDelete) {
      try {
        await PeriodApi.DeletePeriod(periodIdToDelete);
        setPeriods(periods.filter((ev) => ev.id !== periodIdToDelete));
      } catch (error: any) {
        console.log(error);
      }
    }
    setPeriodIdToDelete(undefined);
    setIsYesNoModalOpen(false);
  };

  const modifiedPeriodCallback = (period: PeriodDTO) => {
    const foundPeriod = periods.find((ev) => ev.id === period.id);
    if (foundPeriod) {
      setPeriods(
        periods.map((ev) => {
          if (ev.id === period.id) {
            return period;
          }
          return ev;
        })
      );
      return;
    }
    setPeriods([...periods, period]);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableHeader}>
        <div className={styles.searchContainer}>
          <SearchInput
            searchFunctionCallback={searchFunctionCallback}
            searchString={searchString}
          />
        </div>
        <div className={styles.buttonContainer}>
          <Button
            label="Create new period"
            onClickCallback={createButtonClicked}
          />
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            {/* <th>Id</th> */}

            <TableHeader
              label="Title"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.TITLE}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="Level"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.LEVEL}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="Start Year"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.START_YEAR}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="Start Month"
              sortColumn={PeriodTableHeadersSort.START_MONTH}
              currentSortColumn={sortColumn}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="Start Day"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.START_DAY}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="End Year"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.END_YEAR}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="End Month"
              sortColumn={PeriodTableHeadersSort.END_MONTH}
              currentSortColumn={sortColumn}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />
            <TableHeader
              label="End Day"
              currentSortColumn={sortColumn}
              sortColumn={PeriodTableHeadersSort.END_DAY}
              currentSortDirection={sortDirection}
              handleSort={handleSort}
            />

            <th style={{ border: "none" }}></th>
            <th style={{ border: "none" }}></th>
          </tr>
        </thead>
        <tbody>
          {periods.map((period: PeriodDTO, index: number) => (
            <tr key={index}>
              {/* <td>{period.id}</td> */}
              <td>{period.title}</td>
              <td>{period.level}</td>
              <td>{period.startDay}</td>
              <td>{period.startMonth}</td>
              <td>{period.startDay}</td>
              <td>{period.endDay}</td>
              <td>{period.endMonth}</td>
              <td>{period.endDay}</td>
              <td>
                <div className={styles.centerButton}>
                  <div className={styles.tableButtonContainer}>
                    <Button
                      buttonType={ButtonType.PRIMARY}
                      onClickCallback={() => editButtonClicked(period)}
                      label="Edit"
                    />
                  </div>
                </div>
              </td>
              <td>
                <div className={styles.centerButton}>
                  <div className={styles.tableButtonContainer}>
                    <Button
                      buttonType={ButtonType.HOT}
                      onClickCallback={() => deleteButtonClicked(period.id)}
                      label="Delete"
                    />
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.paginationContainer}>
        <Pagination
          paginationFunctionCallback={paginationFunctionCallback}
          pageIndex={pageIndex}
          totalCount={totalCount}
          pageSize={pageSize}
          setPageIndex={setPageIndex}
        />
      </div>

      {isPeriodModalOpen && (
        <Modal width={400} toggleModal={togglePeriodModal}>
          <PeriodForm
            period={selectedPeriod}
            modifiedPeriodCallback={modifiedPeriodCallback}
            toggleModal={togglePeriodModal}
          />
        </Modal>
      )}

      {isYesNoModalOpen && (
        <Modal width={500} toggleModal={toggleYesNoModal}>
          <YesNoPrompt answerCallback={yesNoPromptAnswer} />
        </Modal>
      )}
    </div>
  );
};

export default PeriodTable;
