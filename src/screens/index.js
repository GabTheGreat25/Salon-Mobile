import Home from "./Home";
import BecomeEmployee from "./BecomeEmployee";
import BecomeCustomer from "./BecomeCustomer";
import UserPick from "./UserPick";
import ChooseRole from "./ChooseRole";
import SignUpCustomer from "./SignUpCustomer";
import SignUpEmployee from "./SignUpEmployee";
import ForgetPassword from "./ForgetPassword";
import LoginUser from "./LoginUser";
import Test from "./Test";
import TestGetById from "./Test/TestGetById";
import CreateTest from "./Test/CreateTest";
import EditTest from "./Test/EditTest";
import AdminDashboard from "./AdminDashboard";
import CustomerDashboard from "./CustomerDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import EditAdminProfile from "./EditAdminProfile";
import EditCustomerProfile from "./EditCustomerProfile";
import EditEmployeeProfile from "./EditEmployeeProfile";
import UpdateUserPassword from "./UpdateUserPassword";
import ConfirmBeautician from "./AdminDashboard/confirmBeautician";
import User from "./User";
import Product from "./Product";
import CreateProduct from "./Product/createProduct";
import EditProduct from "./Product/editProduct";
import Delivery from "./Delivery";
import CreateDelivery from "./Delivery/createDelivery";
import EditDelivery from "./Delivery/editDelivery";
import Service from "./Service";
import CreateService from "./Service/createService";
import EditService from "./Service/editService";
import Relevance from "./CustomerDashboard/relevance";
import Popular from "./CustomerDashboard/popular";
import MostRecent from "./CustomerDashboard/mostRecent";
import Budget from "./CustomerDashboard/budget";
import Cart from "./CustomerDashboard/cart";
import Checkout from "./CustomerDashboard/checkout";
import PaymentOption from "./CustomerDashboard/paymentOption";
import Employee from "./CustomerDashboard/employee";
import ChooseDate from "./CustomerDashboard/chooseDate";
import PastAppointment from "./PastAppointments";
import Settings from "./Settings";
import CheckoutSuccess from "./CustomerDashboard/checkoutSuccess";
import Appointment from "./Appointment";
import EditAppointment from "./Appointment/editAppointment";
import Transaction from "./Transaction";
import EditTransaction from "./Transaction/editTransaction";
import ResetPassword from "./ResetPassword";
import CustomerWaiver from "./AdminDashboard/customerWaiver";
import ConfirmReschedule from "./AdminDashboard/confirmReschedule";
import BeauticianLeave from "./AdminDashboard/beauticianLeave";
import HiringBeautician from "./AdminDashboard/hiringBeautician";
import Comment from "./Comment";
import FeedbackTable from "./FeedbackTable";
import Brand from "./Brand";
import CreateBrand from "./Brand/createBrand";
import EditBrand from "./Brand/editBrand";
import Time from "./Time";
import CreateTime from "./Time/createTime";
import EditTime from "./Time/editTime";
import Status from "./Status";
import CreateStatus from "./Status/createStatus";
import EditStatus from "./Status/editStatus";
import Option from "./Option";
import CreateOption from "./Option/createOption";
import EditOption from "./Option/editOption";
import Exclusion from "./Exclusion";
import CreateExclusion from "./Exclusion/createExclusion";
import EditExclusion from "./Exclusion/editExclusion";
import Month from "./Month";
import EditMonth from "./Month/editMonth";
import AppointmentSchedule from "./AdminDashboard/appointmentSchedule";
import EditBeauticianAppoinment from "./AdminDashboard/editBeauticianAppoinment";
import ViewProduct from "./Product/viewProductById";
import ViewDelivery from "./Delivery/viewDeliveryById";
import ViewService from "./Service/viewServiceById";
import ViewAppointment from "./Appointment/viewAppointmentById";
import ViewTransaction from "./Transaction/viewTransactionById";
import ViewBrand from "./Brand/viewBrand";
import ViewTime from "./Time/viewTime";
import ViewStatus from "./Status/viewStatus";
import ViewOption from "./Option/viewOptionById";
import ViewFeedback from "./FeedbackTable/viewFeedbackById";
import ViewComment from "./Comment/viewCommentById";
import ViewMonth from "./Month/viewMonth";
import ViewScheduleToday from "./AdminDashboard/viewAppointmentSchedule";
import ViewApplyingBeautician from "./AdminDashboard/viewConfirmBeauticianById";
import ViewBeauticianLeave from "./AdminDashboard/viewBeauticianLeave";
import ViewRescheduleAppointment from "./AdminDashboard/viewRescheduleAppointment";
import BeauticianAppointment from "./EmployeeDashboard/beauticianAppointment";
import ViewUser from "./User/viewUserById";
import ViewExclusion from "./Exclusion/viewExclusionById";
import LeaveDateBeautician from "./EmployeeDashboard/leaveDate";
import GetAllLeaveDate from "./EmployeeDashboard/getAllLeaveDate";
import EditLeaveDate from "./EmployeeDashboard/editLeaveDate";
import ViewCustomerById from "./EmployeeDashboard/viewCustomerById";
import BeauticianAppointmentHistory from "./EmployeeDashboard/beauticianAppointmentHistory";
import Hands from "./Ingredients/Hands";
import Hair from "./Ingredients/Hair";
import Facial from "./Ingredients/Facial";
import Body from "./Ingredients/Body";
import Feet from "./Ingredients/Feet";
import Eyelash from "./Ingredients/Eyelash";
import Schedule from "./Schedule";
import CustomerComment from "./Comment/customerComment";
import EditComment from "./Comment/editComment";
import CreateComment from "./Comment/createComment";
import ReceiptHistory from "./Transaction/receipt";
import customerViewServiceById from "./Service/customerViewServiceById";
import EditSchedule from "./Schedule/editSchedule";
import EditChooseDate from "./Schedule/editChooseDate";
import EditBeautician from "./Schedule/editBeautician";
import ReceptionistDashboard from "./ReceptionistDashboard";
import EditReceptionistProfile from "./EditReceptionistProfile";
import ReceptionistLeaveDate from "./ReceptionistDashboard/leaveDate";
import ReceptionistGetAllLeaveDate from "./ReceptionistDashboard/getAllLeaveDate";
import ReceptionistEditLeaveDate from "./ReceptionistDashboard/editLeaveDate";
import SignUpReceptionist from "./SignUpReceptionist";
import ReceptionistCustomer from "./ReceptionistDashboard/customer";
import CustomerReceptionistViewServiceById from "./ReceptionistDashboard/customerReceptionistViewServiceById";
import ReceptionistBudget from "./ReceptionistDashboard/budget";
import ReceptionistPopular from "./ReceptionistDashboard/popular";
import ReceptionistMostRecent from "./ReceptionistDashboard/mostRecent";
import ReceptionistRelevance from "./ReceptionistDashboard/relevance";
import ReceptionistCheckout from "./ReceptionistDashboard/checkout";
import ReceptionistChooseDate from "./ReceptionistDashboard/chooseDate";
import ReceptionistPaymentOption from "./ReceptionistDashboard/paymentOption";
import ReceptionistEmployee from "./ReceptionistDashboard/employee";
import BeauticianSettings from "./Settings/beauticianSettings";
import ReceptionistSettings from "./Settings/receptionistSettings";
import FeedbackScreen from "./FeedbackScreen";
import WalkInAppointment from "./Walk-In-Transaction";

export {
  Home,
  BecomeEmployee,
  BecomeCustomer,
  UserPick,
  ChooseRole,
  SignUpCustomer,
  SignUpEmployee,
  ForgetPassword,
  LoginUser,
  Test,
  TestGetById,
  CreateTest,
  EditTest,
  AdminDashboard,
  CustomerDashboard,
  EmployeeDashboard,
  EditAdminProfile,
  EditCustomerProfile,
  EditEmployeeProfile,
  UpdateUserPassword,
  ConfirmBeautician,
  User,
  Product,
  CreateProduct,
  EditProduct,
  Delivery,
  CreateDelivery,
  EditDelivery,
  Service,
  CreateService,
  EditService,
  Relevance,
  Popular,
  MostRecent,
  Budget,
  Cart,
  Checkout,
  PaymentOption,
  Employee,
  ChooseDate,
  PastAppointment,
  Settings,
  CheckoutSuccess,
  Appointment,
  EditAppointment,
  Transaction,
  EditTransaction,
  ResetPassword,
  CustomerWaiver,
  ConfirmReschedule,
  BeauticianLeave,
  HiringBeautician,
  Comment,
  FeedbackTable,
  Brand,
  CreateBrand,
  EditBrand,
  Time,
  CreateTime,
  EditTime,
  Status,
  CreateStatus,
  EditStatus,
  Option,
  CreateOption,
  EditOption,
  Exclusion,
  CreateExclusion,
  EditExclusion,
  Month,
  EditMonth,
  AppointmentSchedule,
  EditBeauticianAppoinment,
  ViewProduct,
  ViewDelivery,
  ViewService,
  ViewAppointment,
  ViewTransaction,
  ViewBrand,
  ViewTime,
  ViewStatus,
  ViewOption,
  ViewFeedback,
  ViewComment,
  ViewMonth,
  ViewScheduleToday,
  ViewApplyingBeautician,
  ViewBeauticianLeave,
  ViewRescheduleAppointment,
  BeauticianAppointment,
  ViewUser,
  ViewExclusion,
  LeaveDateBeautician,
  GetAllLeaveDate,
  EditLeaveDate,
  ViewCustomerById,
  BeauticianAppointmentHistory,
  Hands,
  Hair,
  Facial,
  Body,
  Feet,
  Eyelash,
  Schedule,
  CustomerComment,
  EditComment,
  CreateComment,
  ReceiptHistory,
  customerViewServiceById,
  EditSchedule,
  EditChooseDate,
  EditBeautician,
  ReceptionistDashboard,
  EditReceptionistProfile,
  ReceptionistLeaveDate,
  ReceptionistGetAllLeaveDate,
  ReceptionistEditLeaveDate,
  SignUpReceptionist,
  ReceptionistCustomer,
  CustomerReceptionistViewServiceById,
  ReceptionistBudget,
  ReceptionistPopular,
  ReceptionistMostRecent,
  ReceptionistRelevance,
  ReceptionistCheckout,
  ReceptionistChooseDate,
  ReceptionistPaymentOption,
  ReceptionistEmployee,
  BeauticianSettings,
  ReceptionistSettings,
  FeedbackScreen,
  WalkInAppointment,
};
