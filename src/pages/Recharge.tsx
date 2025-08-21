import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StepIndicator } from "@/components/StepIndicator";
import { Badge } from "@/components/ui/badge"; 
import { 
  CreditCard, 
  Shield, 
  Zap, 
  CheckCircle, 
  QrCode,
  Copy,
  ArrowRight,
  ArrowLeft,
  ShoppingCart,
  Key,
  User
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// 修改步骤定义，移除"选择服务"步骤
const steps = ["欢迎", "验证卡密", "获取密钥", "确认充值"];

export default function Recharge() {
  // 将初始步骤设置为1（欢迎），下一步将直接跳到验证卡密（步骤2）
  const [currentStep, setCurrentStep] = useState(1);
  const [serviceType, setServiceType] = useState("have-card"); // 默认设置为"have-card"
  const [cardKey, setCardKey] = useState("");
  const [sessionKey, setSessionKey] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [accessToken, setAccessToken] = useState(""); // 添加这行
  const { toast } = useToast();

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 修改handleServiceSelect函数，使其直接进入下一步
  const handleServiceSelect = (type: string) => {
    setServiceType(type);
    if (type === "buy-card") {
      // 跳转到购买页面的逻辑
      window.open("https://example.com/buy", "_blank");
    } else {
      handleNext();
    }
  };

  const verifyCardKey = async () => {
    if (!cardKey.trim()) {
      toast({
        title: "请输入卡密",
        description: "请输入有效的卡密进行验证",
        variant: "destructive"
      });
      return;
    }
    
    // 检查卡密长度是否为16位
    if (cardKey.length !== 16) {
      toast({
        title: "卡密格式错误",
        description: `卡密应为16位字符，当前输入了${cardKey.length}位`,
        variant: "destructive"
      });
      return;
    }

    // 测试逻辑 - 根据特定卡密值返回不同结果
    // if (cardKey === "1231231231231231") {
    //   // 模拟卡密验证失败的情况
    //   toast({
    //     title: "卡密验证失败",
    //     description: "卡密无效",
    //     variant: "destructive"
    //   });
    //   return;
    // } else if (cardKey === "6BAGM1FLRVH21P6X") {
    //   // 模拟卡密验证成功的情况
    //   toast({
    //     title: "验证成功",
    //     description: "卡密验证成功",
    //     variant: "success"
    //   });
    //   handleNext();
    //   return;
    // }

    // 注释掉原有的API调用逻辑
    
    // 调用API接口，将卡密作为GET参数传递
    try {
      const response = await fetch(`https://api.ow520.com/api/card-keys/${cardKey}`);
      if (response.ok) {
        const data = await response.json();
        console.log("API调用成功:", data);
        
        // 根据返回的参数显示相应的提示信息
        if (data.available === false) {
          toast({
            title: "卡密验证失败",
            description: data.error || "卡密无效",
            variant: "destructive"
          });
        } else {
          toast({
            title: "验证成功",
            description: "卡密验证成功",
            variant: "success"
          });
          handleNext();
        }
      } else {
        toast({
          title: "验证失败",
          description: "卡密验证失败，请稍后重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API调用出错:", error);
      toast({
        title: "网络错误",
        description: "无法连接到服务器，请检查网络连接",
        variant: "destructive"
      });
    }
    
  };

  const getSessionKey = () => {
    window.open("https://chatgpt.com/api/auth/session", "_blank");
  };

  const reloginChatGPT = () => {
    window.open("https://chatgpt.com/", "_blank");
  };

  const handleAccountVerify = async () => {
    if (!sessionKey.trim()) {
      toast({
        title: "请输入充值密钥",
        description: "请先获取并输入充值密钥",
        variant: "destructive"
      });
      return;
    }

    try {
      // 解析用户输入的sessionKey（应该是一个JSON字符串）
      const tokenData = JSON.parse(sessionKey);
      
      // 检查是否包含accessToken字段
      if (!tokenData.accessToken) {
        toast({
          title: "密钥格式错误",
          description: "充值密钥必须包含accessToken字段",
          variant: "destructive"
        });
        return;
      }

      // 调用API验证token，只传递access_token字段
      const response = await fetch("https://api.ow520.com/api/parse-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          access_token: tokenData.accessToken
        })
      });

      if (response.ok) {
        const data = await response.json();
        // 从返回的message字段中获取用户邮箱
        setUserEmail(data.message || "user@example.com");
        // 保存access_token以便后续使用
        setAccessToken(tokenData.accessToken);
        toast({
          title: "账户验证成功",
          description: "账户信息已确认",
          variant: "success"
        });
        handleNext();
      } else {
        toast({
          title: "账户验证失败",
          description: "无法验证账户信息，请检查密钥是否正确",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API调用出错:", error);
      if (error instanceof SyntaxError) {
        toast({
          title: "密钥格式错误",
          description: "充值密钥必须是有效的JSON格式",
          variant: "destructive"
        });
      } else {
        toast({
          title: "验证失败",
          description: "账户验证过程中出现错误，请稍后重试",
          variant: "destructive"
        });
      }
    }
  };

  const confirmRecharge = async () => {
    // 检查是否已获取必要的信息
    if (!cardKey.trim()) {
      toast({
        title: "卡密缺失",
        description: "请先输入并验证卡密",
        variant: "destructive"
      });
      return;
    }

    if (!accessToken) {
      toast({
        title: "账户信息缺失",
        description: "请先验证账户信息",
        variant: "destructive"
      });
      return;
    }

    try {
      // 调用API创建充值任务
      const response = await fetch("https://api.ow520.com/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          card_key: cardKey,
          access_token: accessToken
        })
      });
      const data = await response.json();
      if (response.ok) {
        if (data.success && data.task_id) {
          toast({
            title: "充值请求已提交",
            description: "我们正在处理您的充值请求，请耐心等待",
            variant: "success"
          });
          
          // 显示处理中提示
          setShowProcessing(true);
          
          // 开始轮询任务状态
          pollTaskStatus(data.task_id);
        } else {
          // 处理失败情况，如卡密已被使用等
          toast({
            title: "充值请求失败",
            description: data.error || "提交充值请求时出现错误，请稍后重试",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "充值请求失败",
          description: data.error || "提交充值请求时出现错误，请稍后重试",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("API调用出错:", error);
      toast({
        title: "网络错误",
        description: "无法连接到服务器，请检查网络连接",
        variant: "destructive"
      });
    }
  };

  // 轮询任务状态
  const pollTaskStatus = async (taskId: string) => {
    // 检查taskId是否有效
    if (!taskId) {
      toast({
        title: "任务ID缺失",
        description: "无法查询充值任务状态",
        variant: "destructive"
      });
      setShowProcessing(false);
      return;
    }

    let pollCount = 0;
    const maxPollCount = 30;
    const pollInterval = 3000; // 3秒

    const poll = async () => {
      try {
        const response = await fetch(`https://api.ow520.com/api/tasks/${taskId}`);
        
        if (response.ok) {
          const data = await response.json();
          
          // 根据任务状态进行处理
          switch (data.status) {
            case "pending":
            case "processing":
              // 任务仍在处理中，继续轮询
              pollCount++;
              if (pollCount < maxPollCount) {
                setTimeout(poll, pollInterval);
              } else {
                toast({
                  title: "处理超时",
                  description: "充值请求处理时间过长，请稍后查看充值结果",
                  variant: "destructive"
                });
                setShowProcessing(false);
              }
              break;
              
            case "completed":
              // 任务完成，显示成功信息
              toast({
                title: "充值成功",
                description: "您的充值已完成，请前往ChatGPT查看",
                variant: "success"
              });
              setShowProcessing(false);
              break;
              
            case "failed":
            case "unknown":
              // 任务失败，显示错误信息
              toast({
                title: "充值失败",
                description: data.error || "充值过程中出现错误",
                variant: "destructive"
              });
              setShowProcessing(false);
              break;
              
            default:
              // 未知状态
              toast({
                title: "状态未知",
                description: "任务状态未知，请稍后查看充值结果",
                variant: "destructive"
              });
              setShowProcessing(false);
              break;
          }
        } else {
          // HTTP错误
          const errorData = await response.json().catch(() => ({}));
          toast({
            title: "检查失败",
            description: errorData.error || "检查任务状态时出错",
            variant: "destructive"
          });
          setShowProcessing(false);
        }
      } catch (error) {
        console.error("轮询任务状态出错:", error);
        toast({
          title: "网络错误",
          description: "检查任务状态时出现网络错误",
          variant: "destructive"
        });
        setShowProcessing(false);
      }
    };

    // 开始第一次轮询
    setTimeout(poll, pollInterval);
  };

  const [showProcessing, setShowProcessing] = useState(false);

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Card className="card-elevated max-w-lg mx-auto">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200 shadow-sm">
                <span className="text-2xl">🎉</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-4">欢迎使用OpenAI代充系统</h2>
              <p className="text-muted-foreground mb-8">我们为您提供安全、便捷的ChatGPT Plus充值服务</p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-success/10">
                  <CheckCircle className="w-6 h-6 text-success" />
                  <span className="text-sm font-medium">官方正版充值</span>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-info/10">
                  <Shield className="w-6 h-6 text-info" />
                  <span className="text-sm font-medium">安全加密传输</span>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-warning/10">
                  <Zap className="w-6 h-6 text-warning" />
                  <span className="text-sm font-medium">即时到账服务</span>
                </div>
                <div className="flex flex-col items-center space-y-2 p-3 rounded-lg bg-primary/10">
                  <User className="w-6 h-6 text-primary" />
                  <span className="text-sm font-medium">专业客服支持</span>
                </div>
              </div>

              <Button onClick={handleNext} className="w-full btn-primary text-lg py-3">
                开始充值流程
              </Button>
            </CardContent>
          </Card>
        );

      case 2:
        return (
          <Card className="card-elevated max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">验证卡密</CardTitle>
              <p className="text-center text-muted-foreground">请输入您购买的卡密</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="cardkey" className="text-base">卡密</Label>
                  <div className="relative mt-2">
                    <Input
                      id="cardkey"
                      value={cardKey}
                      onChange={(e) => setCardKey(e.target.value)}
                      placeholder="请输入16位卡密"
                      className="text-lg py-3 pr-16"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <span className="text-sm font-medium">
                        {cardKey.length}/16
                      </span>
                    </div>
                  </div>
                </div>

                <Button onClick={verifyCardKey} className="w-full btn-primary text-lg py-3">
                  验证卡密
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 3:
        return (
          <Card className="card-elevated max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">获取充值密钥</CardTitle>
              <p className="text-center text-muted-foreground">已验证卡密：{cardKey}</p>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              {/* 第一步 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">第一步：获取充值密钥</h3>
                <div className="p-4 bg-info/10 rounded-lg border border-info/20 mb-4">
                  <p className="text-sm text-muted-foreground">
                    或直接访问 https://chatgpt.com/api/auth/session，复制所有内容到第二步方框
                  </p>
                </div>
                
                <div className="space-y-3">
                  <Button onClick={getSessionKey} className="w-full btn-primary">
                    <Key className="w-4 h-4 mr-2" />
                    点我获取充值密钥
                  </Button>
                  
                  <div className="p-3 bg-warning/10 rounded-lg border border-warning/20">
                    <p className="text-sm text-warning">
                      如果返回充值密钥是 `{}`，则登录不成功，请点击按钮重新登录
                    </p>
                  </div>
                  
                  <Button onClick={reloginChatGPT} variant="outline" className="w-full">
                    点我重新登录ChatGPT
                  </Button>
                </div>
              </div>

              {/* 第二步 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">第二步：输入充值密钥</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="sessionkey">充值密钥</Label>
                    <textarea
                      id="sessionkey"
                      value={sessionKey}
                      onChange={(e) => setSessionKey(e.target.value)}
                      placeholder="请粘贴获取到的充值密钥"
                      className="w-full mt-2 p-3 border rounded-lg h-32 resize-none"
                    />
                  </div>
                  
                  <Button onClick={handleAccountVerify} className="w-full btn-primary">
                    核对账户
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      case 4:
        return (
          <Card className="card-elevated max-w-lg mx-auto">
            <CardHeader>
              <CardTitle className="text-center text-2xl">确认充值</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="font-medium">账户邮箱：</span>
                    <span className="text-primary">{userEmail || "--"}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="font-medium">Token：</span>
                    <span className="text-primary font-mono text-sm" title={accessToken}>
                      {accessToken ? (
                        <>
                          <span>{accessToken.substring(0, 12)}</span>
                          <span className="opacity-50">...</span>
                          <span>{accessToken.substring(accessToken.length - 8)}</span>
                        </>
                      ) : "--"}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-secondary/50 rounded-lg">
                    <span className="font-medium">卡密：</span>
                    <span className="text-primary font-mono">{cardKey || "--"}</span>
                  </div>
                </div>

                <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                  <div className="flex items-start space-x-2">
                    <input type="checkbox" id="confirm" className="mt-1" />
                    <label htmlFor="confirm" className="text-sm">
                      我确认以上信息无误，同意进行充值操作
                    </label>
                  </div>
                </div>

                <Button onClick={confirmRecharge} className="w-full btn-primary text-lg py-3">
                  确认充值
                </Button>

                {showProcessing && (
                  <div className="text-center">
                    <div className="inline-flex items-center space-x-2 text-sm text-muted-foreground">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <span>正在处理中</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      请不要关闭页面，我们正在为您处理充值请求
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Step Indicator */}
      <StepIndicator steps={steps} currentStep={currentStep} />

      {/* Step Content */}
      <div className="mb-8">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      {currentStep > 1 && currentStep < 5 && (
        <div className="flex justify-center">
          <Button
            onClick={handlePrev}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </Button>
        </div>
      )}
    </div>
  );
}

