public class PercentDiscountPolicy extends DefaultDiscountPolicy {
  private double percent;

  public AmountDiscountPolicy(double percent, DiscountCondition ... conditions) {
    super(conditions);
    this.percent = percent;
  }

  @Override
  protected Money getDiscountAmount(Screening screening) {
    return screening.getMovieFee().times(percent);
  }
}
